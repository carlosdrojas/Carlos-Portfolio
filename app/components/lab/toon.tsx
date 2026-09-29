'use client';

import { createContext, useContext, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Four-step light ramp: flat bands of shade instead of smooth gradients, which is
// what makes the pixelated render read as pixel art.
let ramp: THREE.DataTexture | null = null;
export function getRamp() {
  if (!ramp) {
    const data = new Uint8Array([95, 95, 95, 255, 155, 155, 155, 255, 215, 215, 215, 255, 255, 255, 255, 255]);
    ramp = new THREE.DataTexture(data, 4, 1, THREE.RGBAFormat);
    ramp.minFilter = THREE.NearestFilter;
    ramp.magFilter = THREE.NearestFilter;
    ramp.needsUpdate = true;
  }
  return ramp;
}

// True while the pointer is over the hotspot that contains this material.
export const HotContext = createContext(false);

const HOT = new THREE.Color('#6B4A1A');
const BLACK = new THREE.Color('#000000');

export function Toon({ color, map, side }: { color: string; map?: THREE.Texture | null; side?: THREE.Side }) {
  const hot = useContext(HotContext);
  const gradientMap = useMemo(getRamp, []);
  return (
    <meshToonMaterial
      color={color}
      map={map ?? null}
      side={side ?? THREE.FrontSide}
      gradientMap={gradientMap}
      emissive={hot ? HOT : BLACK}
      emissiveIntensity={hot ? 0.55 : 0}
    />
  );
}

type Vec3 = [number, number, number];

export function Box({ args, color, position, rotation, map, cast = true }: { args: Vec3; color: string; position?: Vec3; rotation?: Vec3; map?: THREE.Texture | null; cast?: boolean }) {
  return (
    <mesh position={position} rotation={rotation} castShadow={cast} receiveShadow>
      <boxGeometry args={args} />
      <Toon color={color} map={map} />
    </mesh>
  );
}

export function Cyl({ args, color, position, rotation }: { args: [number, number, number, number?]; color: string; position?: Vec3; rotation?: Vec3 }) {
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <cylinderGeometry args={[args[0], args[1], args[2], args[3] ?? 20]} />
      <Toon color={color} />
    </mesh>
  );
}

// A glowing screen: ignores lighting so it always reads as lit.
export function Screen({ size, texture, position, rotation }: { size: [number, number]; texture: THREE.Texture; position?: Vec3; rotation?: Vec3 }) {
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={size} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

export function Wire({ points, color, radius = 0.011 }: { points: Vec3[]; color: string; radius?: number }) {
  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
    return new THREE.TubeGeometry(curve, 32, radius, 6, false);
  }, [points, radius]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <mesh geometry={geometry} castShadow>
      <Toon color={color} />
    </mesh>
  );
}

type Draw = (g: CanvasRenderingContext2D, ms: number) => void;

// A canvas-backed texture, redrawn every `intervalMs` (or once when null).
// Nearest filtering keeps the low-res canvas crisp and pixelated.
export function useCanvasTexture(width: number, height: number, draw: Draw, intervalMs: number | null) {
  const { ctx, texture } = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    t.magFilter = THREE.NearestFilter;
    t.minFilter = THREE.NearestFilter;
    t.generateMipmaps = false;
    return { ctx: canvas.getContext('2d')!, texture: t };
  }, [width, height]);

  const drawRef = useRef(draw);
  const last = useRef(-Infinity);
  useLayoutEffect(() => {
    drawRef.current = draw;
  });
  useLayoutEffect(() => {
    drawRef.current(ctx, 0);
    texture.needsUpdate = true;
  }, [ctx, texture]);
  useEffect(() => () => texture.dispose(), [texture]);

  useFrame((state) => {
    if (intervalMs == null) return;
    const now = state.clock.elapsedTime * 1000;
    if (now - last.current < intervalMs) return;
    last.current = now;
    drawRef.current(ctx, now);
    texture.needsUpdate = true;
  });

  return texture;
}

// Loads a .glb from /public/models, swaps its materials for the banded toon look,
// and scales it so its largest side is `size` with its base resting at y = 0.
export function ToonModel({ url, size, position, rotation }: { url: string; size: number; position?: Vec3; rotation?: Vec3 }) {
  const { scene } = useGLTF(url);
  const hot = useContext(HotContext);
  const { object, materials } = useMemo(() => {
    const root = scene.clone(true);
    const box = new THREE.Box3().setFromObject(root);
    const dims = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    root.position.set(-center.x, -box.min.y, -center.z);
    const mats: THREE.MeshToonMaterial[] = [];
    const toToon = (m: THREE.Material) => {
      const src = m as THREE.MeshStandardMaterial;
      const t = new THREE.MeshToonMaterial({ color: src.color ?? new THREE.Color('#ffffff'), map: src.map ?? null, gradientMap: getRamp() });
      mats.push(t);
      return t;
    };
    root.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.material = Array.isArray(mesh.material) ? mesh.material.map(toToon) : toToon(mesh.material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    });
    const wrap = new THREE.Group();
    wrap.add(root);
    wrap.scale.setScalar(size / Math.max(dims.x, dims.y, dims.z));
    return { object: wrap, materials: mats };
  }, [scene, size]);

  useEffect(() => {
    materials.forEach((m) => {
      m.emissive.copy(hot ? HOT : BLACK);
      m.emissiveIntensity = hot ? 0.55 : 0;
    });
  }, [hot, materials]);
  useEffect(() => () => materials.forEach((m) => m.dispose()), [materials]);

  return <primitive object={object} position={position} rotation={rotation} />;
}

export const MODEL_URLS = [
  '/models/soldering-station.glb',
  '/models/multimeter.glb',
  '/models/desk-lamp.glb',
  '/models/office-chair.glb',
  '/models/toolbox.glb',
  '/models/houseplant.glb',
  '/models/headphones.glb',
  '/models/soda-can.glb',
  '/models/screwdriver.glb',
  '/models/circuit-board.glb',
];
MODEL_URLS.forEach((u) => useGLTF.preload(u));
