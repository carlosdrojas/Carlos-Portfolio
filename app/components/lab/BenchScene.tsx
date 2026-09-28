'use client';

import { Suspense, useEffect, useMemo, useRef, type ReactNode, type RefObject } from 'react';
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPixelatedPass } from 'three/examples/jsm/postprocessing/RenderPixelatedPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { HotContext } from './toon';
import { Breadboard, Clipboard, LaunchPad, Laptop, Oscilloscope, Pegboard, Phone, ProbeLead, Props, Room } from './Models';
import { SPOT_ORDER, VIEWS, type SpotId } from './spots';

interface BenchSceneProps {
  active: SpotId | null;
  hovered: SpotId | null;
  onHover: (id: SpotId | null) => void;
  onSelect: (id: SpotId | null) => void;
  reduceMotion: boolean;
}

type GroupRefs = Record<SpotId, RefObject<THREE.Group | null>>;

export default function BenchScene({ active, hovered, onHover, onSelect, reduceMotion }: BenchSceneProps) {
  const refs: GroupRefs = {
    pegboard: useRef<THREE.Group>(null),
    laptop: useRef<THREE.Group>(null),
    phone: useRef<THREE.Group>(null),
    scope: useRef<THREE.Group>(null),
    launchpad: useRef<THREE.Group>(null),
    clipboard: useRef<THREE.Group>(null),
  };

  const spot = (id: SpotId, position: [number, number, number], rotationY: number, children: ReactNode) => (
    <Hotspot id={id} groupRef={refs[id]} position={position} rotationY={rotationY} hot={hovered === id} onHover={onHover} onSelect={onSelect}>
      {children}
    </Hotspot>
  );

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ antialias: false }}
      camera={{ fov: 38, near: 0.05, far: 60, position: [0, 3.2, 5.5] }}
      onPointerMissed={() => onSelect(null)}
      fallback={<p className="p-8 text-center text-[#E8E4DA]">This browser can’t show the 3D bench. Use the buttons below to open each part.</p>}
    >
      <color attach="background" args={['#2A2E35']} />
      <fog attach="fog" args={['#2A2E35', 18, 32]} />
      <hemisphereLight args={['#E4ECF7', '#5E4E3C', 1.1]} />
      <directionalLight
        position={[3.5, 7, 4.5]}
        intensity={2.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0005}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
      />
      <Suspense fallback={null}>
        <Room />
        {spot('pegboard', [0, 2.35, -1.7], 0, <Pegboard />)}
        {spot('laptop', [-1.75, 1.012, 0.35], 0.38, <Laptop />)}
        {spot('phone', [-0.85, 1.012, 1.12], 0.35, <Phone />)}
        {spot('scope', [1.75, 1.012, -0.72], -0.38, <Oscilloscope />)}
        {spot('launchpad', [0.5, 1.012, 0.62], -0.18, <LaunchPad />)}
        {spot('clipboard', [2.1, 1.012, 0.78], -0.42, <Clipboard />)}
        <group position={[-0.05, 1.012, -0.42]}>
          <Breadboard />
        </group>
        <ProbeLead />
        <Props />
      </Suspense>
      <CameraRig active={active} refs={refs} reduceMotion={reduceMotion} />
      <PixelPass />
      <IntroSweep onHover={onHover} skip={reduceMotion} />
    </Canvas>
  );
}

function Hotspot({ id, groupRef, position, rotationY, hot, onHover, onSelect, children }: {
  id: SpotId;
  groupRef: RefObject<THREE.Group | null>;
  position: [number, number, number];
  rotationY: number;
  hot: boolean;
  onHover: (id: SpotId | null) => void;
  onSelect: (id: SpotId | null) => void;
  children: ReactNode;
}) {
  const over = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    onHover(id);
    document.body.style.cursor = 'pointer';
  };
  const out = () => {
    onHover(null);
    document.body.style.cursor = '';
  };
  return (
    <group
      ref={groupRef}
      position={position}
      rotation={[0, rotationY, 0]}
      onPointerOver={over}
      onPointerOut={out}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
    >
      <HotContext.Provider value={hot}>{children}</HotContext.Provider>
    </group>
  );
}

// Lights each object once, in turn, so first-time visitors see what is clickable.
function IntroSweep({ onHover, skip }: { onHover: (id: SpotId | null) => void; skip: boolean }) {
  useEffect(() => {
    if (skip) return;
    const timers = SPOT_ORDER.map((id, i) => setTimeout(() => onHover(id), 900 + i * 380));
    timers.push(setTimeout(() => onHover(null), 900 + SPOT_ORDER.length * 380));
    return () => timers.forEach(clearTimeout);
  }, [onHover, skip]);
  return null;
}

const PORTRAIT_FOV = 55;
// Half the width to keep in frame on portrait screens: the bench plus the wall
// flag and record. The soldering station and toolbox at the far ends may crop.
const BENCH_HALF_WIDTH = 3.05;

function homeView(aspect: number) {
  if (aspect < 0.8) {
    // Portrait: back off along a steep, downward line until the whole bench
    // fits the screen width. A wider lens would fit it closer but would warp
    // the objects at the edges.
    const halfH = Math.atan(Math.tan(THREE.MathUtils.degToRad(PORTRAIT_FOV / 2)) * aspect);
    const dist = BENCH_HALF_WIDTH / Math.tan(halfH);
    const look = new THREE.Vector3(0, 1.55, -0.1);
    // Close to the desktop angle, tipped down a little more to use the tall screen.
    const dir = new THREE.Vector3(0, 0.42, 0.9).normalize();
    return { pos: look.clone().addScaledVector(dir, dist), look };
  }
  if (aspect < 1.3) return { pos: new THREE.Vector3(0, 3.7, 6.9), look: new THREE.Vector3(0, 1.4, -0.2) };
  return { pos: new THREE.Vector3(0, 3.2, 5.5), look: new THREE.Vector3(0, 1.45, -0.25) };
}

// Eases the camera toward the selected object and shifts the view so the object
// stays visible beside the open panel.
function CameraRig({ active, refs, reduceMotion }: { active: SpotId | null; refs: GroupRefs; reduceMotion: boolean }) {
  const { camera, size, pointer } = useThree();
  const pos = useRef<THREE.Vector3 | null>(null);
  const look = useRef(new THREE.Vector3());
  const offset = useRef({ x: 0, y: 0 });
  const target = useMemo(() => ({ pos: new THREE.Vector3(), look: new THREE.Vector3() }), []);

  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    cam.fov = size.width / size.height < 0.8 ? PORTRAIT_FOV : 38;
    cam.updateProjectionMatrix();
  }, [camera, size]);

  useFrame((_, dt) => {
    const home = homeView(size.width / size.height);
    const group = active ? refs[active].current : null;
    if (active && group) {
      const v = VIEWS[active];
      group.updateMatrixWorld();
      target.pos.set(...v.pos);
      target.look.set(...v.look);
      group.localToWorld(target.pos);
      group.localToWorld(target.look);
      // Portrait screens see a narrow slice, so back the camera off to keep the object whole.
      if (size.width / size.height < 0.8) target.pos.sub(target.look).multiplyScalar(1.9).add(target.look);
    } else {
      target.pos.copy(home.pos);
      target.look.copy(home.look);
    }
    if (!pos.current) {
      pos.current = target.pos.clone();
      look.current.copy(target.look);
    }
    const k = reduceMotion ? 1 : 1 - Math.exp(-dt * 3.2);
    pos.current.lerp(target.pos, k);
    look.current.lerp(target.look, k);

    camera.position.copy(pos.current);
    if (!active && !reduceMotion) {
      camera.position.x += pointer.x * 0.3;
      camera.position.y += pointer.y * 0.15;
    }
    camera.lookAt(look.current);

    const mobile = size.width <= 720;
    const tx = active && !mobile ? Math.min(480, size.width - 32) / 2 + 8 : 0;
    const ty = active && mobile ? size.height * 0.3 : 0;
    offset.current.x += (tx - offset.current.x) * k;
    offset.current.y += (ty - offset.current.y) * k;
    const cam = camera as THREE.PerspectiveCamera;
    if (Math.abs(offset.current.x) > 0.5 || Math.abs(offset.current.y) > 0.5) {
      cam.setViewOffset(size.width, size.height, offset.current.x, offset.current.y, size.width, size.height);
    } else if (cam.view) {
      cam.clearViewOffset();
    }
  });

  return null;
}

// Renders the scene at low resolution with depth and normal edge highlights,
// then scales it up without smoothing.
function PixelPass() {
  const { gl, scene, camera, size, viewport } = useThree();
  // One art pixel is 2 CSS px on desktop and 1.5 on phones, at any screen density.
  const pixelSize = Math.max(1, Math.round((size.width <= 720 ? 1.5 : 2) * viewport.dpr));
  const { composer, pass } = useMemo(() => {
    const c = new EffectComposer(gl);
    const p = new RenderPixelatedPass(2, scene, camera, { normalEdgeStrength: 0.3, depthEdgeStrength: 0.4 });
    c.addPass(p);
    c.addPass(new OutputPass());
    return { composer: c, pass: p };
  }, [gl, scene, camera]);

  useEffect(() => {
    composer.setPixelRatio(viewport.dpr);
    composer.setSize(size.width, size.height);
  }, [composer, size, viewport.dpr]);
  useEffect(() => {
    pass.setPixelSize(pixelSize);
  }, [pass, pixelSize]);
  useEffect(() => () => composer.dispose(), [composer]);

  useFrame(() => composer.render(), 1);
  return null;
}
