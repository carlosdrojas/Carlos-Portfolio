'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { projects } from '../../data/projects';
import { Box, Cyl, Screen, Toon, ToonModel, Wire, useCanvasTexture } from './toon';
import { CHANNEL_COLORS, CHANNEL_LABELS } from './spots';
import { GAME_H, GAME_W, ROW_COLORS, game } from './invadersEngine';

/* ---------- room and bench ---------- */

export function Room() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <Toon color="#3A3F48" />
      </mesh>
      <mesh position={[0, 4, -1.75]} receiveShadow>
        <planeGeometry args={[30, 10]} />
        <Toon color="#B9C3CD" />
      </mesh>
      {/* bench top, legs, anti-static mat */}
      <Box args={[7.2, 0.1, 3.2]} color="#C28E5C" position={[0, 0.95, 0.1]} />
      {([[-3.45, -1.35], [3.45, -1.35], [-3.45, 1.55], [3.45, 1.55]] as const).map(([x, z]) => (
        <Box key={`${x}${z}`} args={[0.12, 0.9, 0.12]} color="#59606A" position={[x, 0.45, z]} />
      ))}
      <Box args={[5.6, 0.012, 2.35]} color="#3F6B72" position={[0, 1.006, 0.2]} />
      {/* power strip along the back edge */}
      <Box args={[1.1, 0.06, 0.14]} color="#E9E6DF" position={[-0.6, 1.04, -1.3]} />
      {[0, 1, 2, 3].map((i) => (
        <Box key={i} args={[0.12, 0.012, 0.08]} color="#2A2D33" position={[-0.98 + i * 0.26, 1.072, -1.3]} cast={false} />
      ))}
    </group>
  );
}

/* ---------- pegboard with pinned project photos ---------- */

const PIN_COLORS = ['#D94A3D', '#2F6FEB', '#E8C547', '#2E9E5B', '#D94A3D', '#2F6FEB'];
const PINNED = projects.slice(0, 6);
// Small copies in /public/lab/thumbs keep the pegboard light (the originals are up to 3 MB).
const thumb = (src: string) => `/lab/thumbs/${src.replace(/^\//, '').replace(/\.\w+$/, '')}.jpg`;
// Snapshots from the classic site's hero, taped into the gaps between projects.
const SNAPSHOTS: { src: string; size: [number, number]; position: [number, number, number]; tilt: number }[] = [
  { src: '/lab/thumbs/stack-pic-2.jpg', size: [0.54, 0.36], position: [-0.83, 0.62, 0.05], tilt: -0.09 },
  { src: '/lab/thumbs/stack-pic-3.jpg', size: [0.5, 0.375], position: [-0.48, -0.52, 0.05], tilt: 0.08 },
  { src: '/lab/thumbs/stack-pic-4.jpg', size: [0.36, 0.48], position: [0.97, -0.45, 0.05], tilt: -0.06 },
];
const PHOTO_URLS = [...PINNED.map((p) => thumb(p.image)), '/lab/me.jpg', ...SNAPSHOTS.map((s) => s.src)];

export function Pegboard() {
  const photos = useTexture(PHOTO_URLS, (loaded) => {
    (Array.isArray(loaded) ? loaded : [loaded]).forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.minFilter = THREE.NearestFilter;
      t.magFilter = THREE.NearestFilter;
      t.generateMipmaps = false;
    });
  });

  const board = useCanvasTexture(512, 212, (g) => {
    g.setTransform(2, 0, 0, 2, 0, 0);
    g.fillStyle = '#D9B98A';
    g.fillRect(0, 0, 256, 106);
    g.fillStyle = '#7E6541';
    for (let y = 4; y < 106; y += 7) for (let x = 4; x < 256; x += 7) g.fillRect(x, y, 2, 2);
    g.fillStyle = '#EDE3C4';
    g.fillRect(16, 9, 44, 12);
    g.fillStyle = '#3B3326';
    g.font = 'bold 9px monospace';
    g.fillText('projects', 20, 18);
  }, null);

  return (
    <group>
      <Box args={[4.8, 2.0, 0.04]} color="#FFFFFF" map={board} />
      {PINNED.map((p, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        return (
          <group key={p.id} position={[-1.45 + col * 1.45 + (row ? 0.25 : -0.1), 0.42 - row * 0.82, 0.03]} rotation={[0, 0, [0.04, -0.03, 0.05, -0.05, 0.02, -0.02][i]]}>
            <Box args={[0.78, 0.66, 0.012]} color="#F4F2EC" />
            <mesh position={[0, 0.04, 0.008]}>
              <planeGeometry args={[0.7, 0.5]} />
              <Toon color="#FFFFFF" map={photos[i]} />
            </mesh>
            <mesh position={[0, 0.29, 0.03]} castShadow>
              <sphereGeometry args={[0.032, 10, 8]} />
              <Toon color={PIN_COLORS[i]} />
            </mesh>
          </group>
        );
      })}
      {/* a photo of me, pinned up with the projects */}
      <group position={[2.02, 0.4, 0.045]} rotation={[0, 0, -0.07]}>
        <Box args={[0.66, 0.62, 0.012]} color="#FBFAF6" />
        <mesh position={[0, 0.05, 0.008]}>
          <planeGeometry args={[0.58, 0.44]} />
          <Toon color="#FFFFFF" map={photos[PINNED.length]} />
        </mesh>
        <mesh position={[0, 0.27, 0.03]} castShadow>
          <sphereGeometry args={[0.032, 10, 8]} />
          <Toon color="#E8C547" />
        </mesh>
      </group>
      {SNAPSHOTS.map(({ src, size: [w, h], position, tilt }, i) => (
        <group key={src} position={position} rotation={[0, 0, tilt]}>
          <Box args={[w + 0.06, h + 0.06, 0.01]} color="#FBFAF6" />
          <mesh position={[0, 0, 0.007]}>
            <planeGeometry args={[w, h]} />
            <Toon color="#FFFFFF" map={photos[PINNED.length + 1 + i]} />
          </mesh>
          {/* a strip of masking tape across the top */}
          <Box args={[0.2, 0.06, 0.004]} color="#E6D9AE" position={[0, h / 2 + 0.02, 0.012]} rotation={[0, 0, -tilt * 1.5]} cast={false} />
        </group>
      ))}
      {/* a screwdriver on a hook, a spare board, and a coil of wire */}
      <Cyl args={[0.012, 0.012, 0.12]} color="#8E959E" position={[2.15, -0.28, 0.06]} rotation={[Math.PI / 2, 0, 0]} />
      <ToonModel url="/models/screwdriver.glb" size={0.42} position={[2.15, -0.72, 0.06]} rotation={[-Math.PI / 2, 0, 0]} />
      <group position={[-2.08, -0.47, 0.07]} rotation={[Math.PI / 2, 0, 0.06]} scale={0.0048}>
        <LaunchPadKit />
      </group>
      <mesh position={[-2.05, 0.5, 0.08]} castShadow>
        <torusGeometry args={[0.13, 0.03, 8, 20]} />
        <Toon color="#E8C547" />
      </mesh>
    </group>
  );
}

/* ---------- laptop running yash ---------- */

const TERM_LINES: [string, string, string][] = [
  ['#7FB4FF', 'carlos@bench:~$ ', 'whoami'],
  ['', '', 'carlos rojas, ece @ ut austin'],
  ['#7FB4FF', 'carlos@bench:~$ ', './yash'],
  ['#9BE07B', 'yash> ', 'ls | grep .c'],
  ['', '', 'yash.c  parser.c  jobs.c'],
  ['#9BE07B', 'yash> ', 'sleep 30 &'],
  ['#8B95A3', '', '[1] 4211'],
  ['#9BE07B', 'yash> ', ''],
];

export function Laptop() {
  const keys = useCanvasTexture(128, 86, (g) => {
    g.fillStyle = '#B7BDC7';
    g.fillRect(0, 0, 128, 86);
    g.fillStyle = '#2B2F36';
    for (let r = 0; r < 5; r++) for (let c = 0; c < 13; c++) g.fillRect(6 + c * 9, 5 + r * 8, 7, 6);
    g.fillRect(36, 46, 54, 6);
    g.fillStyle = '#A3A9B3';
    g.fillRect(44, 58, 40, 22);
  }, null);

  const term = useCanvasTexture(320, 200, (g, ms) => {
    g.fillStyle = '#151A21';
    g.fillRect(0, 0, 320, 200);
    g.fillStyle = '#232A33';
    g.fillRect(0, 0, 320, 16);
    ['#EC6A5E', '#F4BF4F', '#61C554'].forEach((c, i) => {
      g.fillStyle = c;
      g.fillRect(8 + i * 11, 5, 6, 6);
    });
    g.font = '13px monospace';
    TERM_LINES.forEach(([pc, prompt, text], i) => {
      const y = 36 + i * 21;
      let x = 10;
      if (prompt) {
        g.fillStyle = pc;
        g.fillText(prompt, x, y);
        x += g.measureText(prompt).width;
      }
      g.fillStyle = pc && !prompt ? pc : '#D8DEE6';
      g.fillText(text, x, y);
      x += g.measureText(text).width;
      if (i === TERM_LINES.length - 1 && Math.floor(ms / 530) % 2 === 0) {
        g.fillStyle = '#D8DEE6';
        g.fillRect(x + 2, y - 11, 8, 13);
      }
    });
  }, 265);

  return (
    <group>
      <Box args={[1.25, 0.045, 0.86]} color="#B7BDC7" position={[0, 0.0225, 0]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.0462, 0.02]}>
        <planeGeometry args={[1.18, 0.78]} />
        <Toon color="#FFFFFF" map={keys} />
      </mesh>
      <group position={[0, 0.045, -0.425]} rotation={[-0.26, 0, 0]}>
        <Box args={[1.25, 0.82, 0.035]} color="#B7BDC7" position={[0, 0.41, 0]} />
        <Box args={[1.2, 0.77, 0.004]} color="#16191E" position={[0, 0.41, 0.019]} />
        <Screen size={[1.12, 0.7]} texture={term} position={[0, 0.415, 0.0215]} />
      </group>
    </group>
  );
}

/* ---------- oscilloscope: one trace per job ---------- */

export function Oscilloscope() {
  // Each channel is one job. Its beam sweeps left to right and writes the
  // company name into the trace, the way a scope in XY mode can draw text.
  const screen = useCanvasTexture(384, 272, (g, ms) => {
    const W = 384;
    const H = 272;
    const rowH = 76;
    g.fillStyle = '#0B1016';
    g.fillRect(0, 0, W, H);
    g.fillStyle = 'rgba(160,180,200,0.16)';
    for (let i = 1; i < 10; i++) g.fillRect(Math.round((i * W) / 10), 0, 1, H - 30);
    for (let j = 1; j < 8; j++) g.fillRect(0, Math.round((j * (H - 30)) / 8), W, 1);

    CHANNEL_LABELS.forEach((label, i) => {
      const color = CHANNEL_COLORS[i];
      const mid = 8 + i * rowH + rowH / 2;
      const period = 3200;
      const t = ((ms + i * 700) % period) / period;
      const beam = Math.min(W, t * W * 1.25);
      g.font = 'bold 44px monospace';
      const textW = g.measureText(label).width;
      const textX = 52;
      const wave = (x: number) => {
        if (x >= textX - 6 && x <= textX + textW + 6) return mid;
        const k = [0.25, 0.16, 0.1][i];
        if (i === 0) return mid + (Math.sin(x * k) > 0 ? -9 : 9);
        if (i === 1) return mid + Math.sin(x * k) * 10;
        return mid + ((((x * k) / (Math.PI * 2)) % 1) * 20 - 10);
      };
      const drawRow = (limit: number, alpha: number) => {
        g.save();
        g.beginPath();
        g.rect(0, mid - rowH / 2, limit, rowH);
        g.clip();
        g.globalAlpha = alpha;
        g.strokeStyle = color;
        g.lineWidth = 3;
        g.beginPath();
        for (let x = 40; x <= W; x += 2) {
          if (x === 40) g.moveTo(x, wave(x));
          else g.lineTo(x, wave(x));
        }
        g.stroke();
        g.lineWidth = 3;
        g.strokeText(label, textX, mid + 15);
        g.restore();
      };
      drawRow(W, 0.18);
      drawRow(beam, 1);
      if (beam < W) {
        g.fillStyle = '#FFFFFF';
        g.fillRect(Math.round(beam) - 2, Math.round(wave(beam)) - 2, 5, 5);
      }
      g.fillStyle = color;
      g.fillRect(4, mid - 11, 30, 22);
      g.fillStyle = '#0B1016';
      g.font = 'bold 13px monospace';
      g.fillText(`CH${i + 1}`, 7, mid + 5);
    });

    g.fillStyle = '#10161E';
    g.fillRect(0, H - 30, W, 30);
    g.font = '13px monospace';
    g.fillStyle = '#9FB0C2';
    g.fillText('EXPERIENCE  3 CH  NEWEST FIRST', 8, H - 11);
  }, 60);

  return (
    <group>
      <Box args={[1.5, 0.9, 0.85]} color="#D8D6CC" position={[0, 0.45, 0]} />
      <Box args={[1.44, 0.84, 0.02]} color="#2A2F37" position={[0, 0.45, 0.43]} />
      <Screen size={[0.84, 0.6]} texture={screen} position={[-0.24, 0.49, 0.442]} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Cyl key={i} args={[0.05, 0.055, 0.05]} color="#9098A3" position={[0.34 + (i % 2) * 0.18, 0.72 - Math.floor(i / 2) * 0.2, 0.45]} rotation={[Math.PI / 2, 0, 0]} />
      ))}
      {CHANNEL_COLORS.map((c, i) => (
        <Box key={c} args={[0.08, 0.04, 0.02]} color={c} position={[-0.52 + i * 0.14, 0.1, 0.45]} />
      ))}
      {[0, 1, 2].map((j) => (
        <Cyl key={j} args={[0.025, 0.025, 0.05]} color="#C9CED6" position={[0.2 + j * 0.16, 0.1, 0.455]} rotation={[Math.PI / 2, 0, 0]} />
      ))}
      {/* carry handle and feet */}
      <mesh position={[0, 0.9, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <torusGeometry args={[0.28, 0.03, 6, 16, Math.PI]} />
        <Toon color="#5A616B" />
      </mesh>
      {[-0.6, 0.6].map((x) => (
        <Box key={x} args={[0.12, 0.03, 0.7]} color="#2A2F37" position={[x, 0.015, 0]} />
      ))}
    </group>
  );
}

/* ---------- breadboard with a blinking LED ---------- */

export function Breadboard() {
  const led = useRef<THREE.MeshBasicMaterial>(null);
  const glow = useRef<THREE.PointLight>(null);
  const holes = useCanvasTexture(128, 45, (g) => {
    g.fillStyle = '#EFEDE6';
    g.fillRect(0, 0, 128, 45);
    g.fillStyle = '#D94A3D';
    g.fillRect(2, 2, 124, 1);
    g.fillRect(2, 37, 124, 1);
    g.fillStyle = '#2F63C8';
    g.fillRect(2, 8, 124, 1);
    g.fillRect(2, 43, 124, 1);
    g.fillStyle = '#6C675D';
    for (let x = 4; x < 125; x += 3) {
      g.fillRect(x, 4, 1, 1);
      g.fillRect(x, 39, 1, 1);
      for (let y = 12; y < 35; y += 3) if (y !== 21 && y !== 24) g.fillRect(x, y, 1, 1);
    }
  }, null);

  useFrame((state) => {
    const on = Math.floor(state.clock.elapsedTime / 0.7) % 2 === 0;
    if (led.current) led.current.color.set(on ? '#FF4A3D' : '#5A1512');
    if (glow.current) glow.current.intensity = on ? 0.8 : 0;
  });

  return (
    <group>
      <Box args={[1.2, 0.07, 0.42]} color="#EFEDE6" position={[0, 0.035, 0]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.0705, 0]}>
        <planeGeometry args={[1.2, 0.42]} />
        <Toon color="#FFFFFF" map={holes} />
      </mesh>
      <Box args={[0.22, 0.04, 0.09]} color="#1F2226" position={[-0.15, 0.09, 0]} />
      {[-0.24, -0.18, -0.12, -0.06].map((x) =>
        [-0.05, 0.05].map((z) => <Box key={`${x}${z}`} args={[0.012, 0.03, 0.012]} color="#B7BCC2" position={[x, 0.075, z]} cast={false} />),
      )}
      <Wire points={[[-0.5, 0.07, -0.17], [-0.45, 0.2, -0.1], [-0.35, 0.07, -0.02]]} color="#D94A3D" />
      <Wire points={[[-0.42, 0.07, 0.17], [-0.3, 0.18, 0.12], [-0.2, 0.07, 0.08]]} color="#1F2226" />
      <Wire points={[[0.05, 0.07, -0.06], [0.18, 0.16, -0.02], [0.3, 0.07, 0.04]]} color="#E8C547" />
      <Wire points={[[0.12, 0.07, 0.12], [0.28, 0.2, 0.05], [0.45, 0.07, -0.15]]} color="#2E9E5B" />
      <Cyl args={[0.016, 0.016, 0.09]} color="#C8A57A" position={[0.3, 0.09, 0.1]} rotation={[0, 0, Math.PI / 2]} />
      <Cyl args={[0.03, 0.03, 0.07]} color="#2F63C8" position={[0.1, 0.11, 0.14]} />
      <mesh position={[0.42, 0.11, 0.06]}>
        <sphereGeometry args={[0.03, 10, 8]} />
        <meshBasicMaterial ref={led} color="#FF4A3D" toneMapped={false} />
      </mesh>
      <pointLight ref={glow} color="#FF3B30" intensity={0.8} distance={0.9} position={[0.42, 0.2, 0.06]} />
    </group>
  );
}

/* ---------- the Space Invaders board: custom PCB, LCD, and LP-MSPM0G3507 ---------- */

// Everything below is modelled in millimetres, from the KiCad project (CDR3585) and
// TI's LaunchPad user guide (SLAU873), then scaled down to bench units.
const MM = 0.0085;
const BOARD = { w: 114.3, d: 88.9, cx: 107.95, cz: 82.55 };
const PCB_TOP = 21.6;
const PCB_T = 1.6;
const kx = (x: number) => x - BOARD.cx;
const kz = (y: number) => y - BOARD.cz;

const LP_PIN_X = [-22.86, -20.32, 20.32, 22.86];
// The real panel is 128x160, but the bench's pixel pass can't resolve that much, so the
// LCD draws at 3/4 size with a 7x5 version of the sprite that stays readable.
const LCD_W = 96;
const LCD_H = 120;
const LCD_SPRITE = [
  ['.X...X.', '..XXX..', '.XXXXX.', 'XX.X.XX', 'X.X.X.X'],
  ['.X...X.', '..XXX..', '.XXXXX.', 'XX.X.XX', '.X...X.'],
];

function LaunchPadSilk() {
  return useCanvasTexture(224, 416, (g) => {
    g.fillStyle = '#C21F2B';
    g.fillRect(0, 0, 224, 416);
    g.strokeStyle = '#A41822';
    g.lineWidth = 1;
    for (let i = 0; i < 14; i++) {
      g.beginPath();
      g.moveTo(60 + i * 8, 60);
      g.lineTo(60 + i * 8, 150 + (i % 3) * 8);
      g.lineTo(110 + i * 4, 190);
      g.lineTo(110 + i * 4, 330);
      g.stroke();
    }
    g.strokeStyle = '#F5F5F0';
    g.setLineDash([4, 3]);
    g.beginPath();
    g.moveTo(0, 158);
    g.lineTo(224, 158);
    g.stroke();
    g.setLineDash([]);
    g.fillStyle = '#F5F5F0';
    g.font = 'bold 13px monospace';
    g.fillText('LP-MSPM0G3507', 62, 206);
    g.font = 'bold 9px monospace';
    g.fillText('XDS110-ET', 150, 40);
    g.fillText('MSPM0G3507', 76, 290);
    g.fillText('RGB', 72, 402);
    g.fillText('LIGHT', 170, 402);
  }, null);
}

// LP-MSPM0G3507, from Figure 2-1 of the user guide and the KiCad footprint. The origin
// is the footprint origin; the bottom of the board sits at y = 0.
function LaunchPadKit() {
  const silk = LaunchPadSilk();
  const pins = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    let i = 0;
    LP_PIN_X.forEach((x) => {
      for (let n = 0; n < 10; n++) pins.current?.setMatrixAt(i++, m.makeTranslation(x, 4.8, -2.54 + n * 2.54));
    });
    if (pins.current) pins.current.instanceMatrix.needsUpdate = true;
  }, []);
  const part = (x: number, y: number, w: number, d: number, h: number, color: string) => (
    <Box args={[w, h, d]} color={color} position={[x, PCB_T + h / 2, y]} />
  );

  return (
    <group>
      <Box args={[55.88, PCB_T, 104.14]} color="#FFFFFF" map={silk} position={[0, PCB_T / 2, -1.27]} />
      {/* debug side: Micro-B USB, reset button, XDS110 */}
      {part(-19.7, -51, 8, 6, 3, '#C9CED6')}
      {part(17.8, -50.5, 7.6, 5.6, 3.4, '#E6E6E6')}
      {part(-11, -33, 13, 13, 1.4, '#17191C')}
      {part(10, -38, 4.5, 4.5, 1, '#17191C')}
      {part(14, -24.5, 6, 5, 1.2, '#17191C')}
      {/* J101 isolation block, with its row of jumpers */}
      {part(-6, -17.2, 21.5, 4.6, 2.4, '#15171A')}
      {Array.from({ length: 9 }, (_, i) => (
        <Box key={i} args={[1.9, 2, 4]} color={i < 3 ? '#E8C547' : '#23262B'} position={[-15.5 + i * 2.38, PCB_T + 3.2, -17.2]} />
      ))}
      {/* S1 and S2 on the board edges */}
      {part(-26, -7.6, 3.8, 5, 3, '#E6E6E6')}
      {part(26, -7.6, 3.8, 5, 3, '#E6E6E6')}
      {/* MSPM0G3507, the target */}
      {part(2.2, 7.8, 12, 12, 1.4, '#17191C')}
      <Box args={[1, 0.1, 1]} color="#8E959E" position={[-2.6, PCB_T + 1.45, 3]} />
      {part(-14, 25, 8.5, 6.5, 1.6, '#23262B')}
      {part(-22, 42, 4.8, 4, 1.2, '#17191C')}
      {/* RGB LED, red LED, pullup jumper, light sensor, QEI and extension header */}
      {part(-5.6, 38.8, 6, 6, 1.6, '#F2F2F2')}
      {part(1.8, 39, 2, 5, 1, '#E0453A')}
      {part(7.8, 40, 5, 7.5, 3, '#15171A')}
      {part(16, 39, 6.5, 6.5, 1.4, '#3A3D44')}
      {part(26, 34.5, 2.6, 13, 2.4, '#15171A')}
      {part(2.8, 48.4, 39, 4.8, 0.4, '#D6B25C')}
      {/* BoosterPack headers: male pins on top, sockets underneath */}
      {[-21.59, 21.59].map((x) => (
        <group key={x}>
          <Box args={[5.08, 2.5, 25.4]} color="#15171A" position={[x, PCB_T + 1.25, 8.89]} />
          <Box args={[5.08, 8.5, 25.4]} color="#15171A" position={[x, -4.25, 8.89]} />
        </group>
      ))}
      <instancedMesh ref={pins} args={[undefined, undefined, 40]} castShadow>
        <boxGeometry args={[0.64, 9.6, 0.64]} />
        <Toon color="#D6B25C" />
      </instancedMesh>
    </group>
  );
}

function ThumbStick({ x, y }: { x: number; y: number }) {
  return (
    <group position={[kx(x), PCB_TOP, kz(y)]}>
      <Cyl args={[10.5, 11.5, 7, 8]} color="#2A2D33" position={[0, 3.5, 0]} />
      <Cyl args={[2.6, 3.4, 6]} color="#3A3D44" position={[0, 9.5, 0]} />
      <Cyl args={[8.5, 8, 3.4]} color="#17191C" position={[0, 13.5, 0]} />
    </group>
  );
}

// The four tact switches, centred on their footprints, and what each does in the game.
const BOARD_BUTTONS = [
  { id: 'SW1', x: 142.5, y: 72, action: 'fire' },
  { id: 'SW2', x: 132, y: 81, action: 'left' },
  { id: 'SW3', x: 143, y: 88.5, action: 'fire' },
  { id: 'SW4', x: 152.5, y: 80.5, action: 'right' },
] as const;

const SW_CAP_TOP = 6.6;
const SW_TRAVEL = 1.1;

// A clickable switch. While the game is open it drives the game; otherwise a click falls
// through and opens the panel like the rest of the board. The cap also dips for key
// presses and the panel's on-screen controls, since they all press the same inputs.
function BoardButton({ x, y, action, playing }: { x: number; y: number; action: 'fire' | 'left' | 'right'; playing: boolean }) {
  const cap = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!cap.current) return;
    const down = action === 'fire' ? performance.now() - game.firedAt < 140 : game.input[action];
    cap.current.position.y = SW_CAP_TOP - 1 - (down ? SW_TRAVEL : 0);
  });

  const press = (e: ThreeEvent<PointerEvent>) => {
    if (!playing) return;
    e.stopPropagation();
    if (action === 'fire') {
      game.fire();
      return;
    }
    game.input[action] = true;
    const release = () => {
      game.input[action] = false;
      window.removeEventListener('pointerup', release);
      window.removeEventListener('pointercancel', release);
    };
    window.addEventListener('pointerup', release);
    window.addEventListener('pointercancel', release);
  };

  return (
    <group position={[kx(x), PCB_TOP, kz(y)]}>
      <mesh ref={cap} position={[0, SW_CAP_TOP - 1, 0]} castShadow>
        <cylinderGeometry args={[2, 2, 2, 12]} />
        <Toon color="#2B2E34" />
      </mesh>
      {/* a generous, invisible hit area: the real caps are tiny at this scale */}
      <mesh visible={false} position={[0, 4, 0]} onPointerDown={press}>
        <boxGeometry args={[9.5, 8, 9.5]} />
      </mesh>
    </group>
  );
}

// PCB traces and silk are baked into a texture from the KiCad layers; the through-hole
// parts come from the KiCad export. KiCad has no 3D model for the joysticks or the
// slide pot, and its LCD model doesn't line up with the footprint, so those are built here.
function CustomBoard({ playing }: { playing: boolean }) {
  const top = useTexture('/lab/custom-pcb-top.png', (t) => {
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
  });
  const knob = useRef<THREE.Mesh>(null);

  // The running game. Its coordinates are mapped to fit the portrait screen, with
  // sprites drawn at the LCD's own pixel size.
  const lcd = useCanvasTexture(LCD_W, LCD_H, (g) => {
    game.tick(performance.now());
    const sx = LCD_W / GAME_W;
    const sy = LCD_H / GAME_H;
    const label = (t: string, x: number, y: number, size: number, color: string, align: CanvasTextAlign = 'center') => {
      g.fillStyle = color;
      g.font = `bold ${size}px monospace`;
      g.textAlign = align;
      g.fillText(t, x, y);
    };
    g.fillStyle = '#050607';
    g.fillRect(0, 0, LCD_W, LCD_H);
    label(`${game.score}`, 3, 9, 8, '#C9CED6', 'left');
    label(`x${game.lives}`, LCD_W - 3, 9, 8, '#C9CED6', 'right');
    game.invaders.forEach((inv) => {
      if (!inv.alive) return;
      g.fillStyle = ROW_COLORS[inv.row];
      LCD_SPRITE[game.frame].forEach((row, y) => {
        for (let x = 0; x < row.length; x++) {
          if (row[x] === 'X') g.fillRect(Math.round(inv.x * sx) + x, Math.round(inv.y * sy) + y, 1, 1);
        }
      });
    });
    const px = Math.round(game.px * sx);
    const shipY = Math.round((GAME_H - 18) * sy);
    g.fillStyle = '#EDEFF2';
    g.fillRect(px - 4, shipY, 9, 3);
    g.fillRect(px - 1, shipY - 2, 3, 2);
    g.fillStyle = '#FFFFFF';
    game.shots.forEach((s) => g.fillRect(Math.round(s.x * sx), Math.round(s.y * sy), 1, 3));
    g.fillStyle = '#FF7A66';
    game.bombs.forEach((b) => g.fillRect(Math.round(b.x * sx), Math.round(b.y * sy), 1, 3));
    g.fillStyle = '#2E7D5B';
    g.fillRect(0, Math.round((GAME_H - 8) * sy), LCD_W, 1);

    const banner = game.state === 'ready' ? (['SPACE INVADERS', '#E8C547'] as const)
      : game.state === 'over' ? (['GAME OVER', '#FF7A66'] as const)
      : game.state === 'win' ? (['BOARD CLEARED', '#9BE07B'] as const)
      : game.paused ? (['PAUSED', '#EDEFF2'] as const) : null;
    if (banner) label(banner[0], LCD_W / 2, 78, 10, banner[1]);
  }, 50);

  // The original firmware steered the ship with the slide pot, so its knob follows the ship.
  useFrame(() => {
    if (knob.current) knob.current.position.x = kx(107.1) + (game.px / GAME_W - 0.5) * 22;
  });

  return (
    <group>
      <Box args={[BOARD.w, PCB_T, BOARD.d]} color="#FFFFFF" map={top} position={[0, PCB_TOP - PCB_T / 2, 0]} />
      <ToonModel url="/models/custom-pcb-parts.glb" scale={1000} position={[0, PCB_TOP, 0]} />

      {/* slide pot and the two joysticks */}
      <Box args={[35.4, 6, 9]} color="#23262B" position={[kx(107.1), PCB_TOP + 3, kz(119.85)]} />
      <Box args={[24, 0.2, 1.4]} color="#050607" position={[kx(107.1), PCB_TOP + 6.05, kz(119.85)]} />
      <mesh ref={knob} position={[kx(107.1), PCB_TOP + 8, kz(119.85)]} castShadow>
        <boxGeometry args={[4, 5, 5]} />
        <Toon color="#D9DCE1" />
      </mesh>
      <ThumbStick x={71.8} y={110.6} />
      <ThumbStick x={146.3} y={109.1} />

      {BOARD_BUTTONS.map((b) => (
        <BoardButton key={b.id} {...b} playing={playing} />
      ))}

      {/* ST7735R LCD on its 8-pin header, with the panel over the footprint's display area */}
      <group position={[kx(107), PCB_TOP, kz(77)]}>
        <Box args={[20.32, 9, 2.54]} color="#15171A" position={[-2.54, 4.5, 25.4]} />
        {([[-14.6, -25.4], [14.6, -25.4], [-14.6, 25.4], [14.6, 25.4]] as const).map(([x, z]) => (
          <Cyl key={`${x}${z}`} args={[1.4, 1.4, 9, 8]} color="#D6B25C" position={[x, 4.5, z]} />
        ))}
        <Box args={[34.29, 1.6, 55.88]} color="#1C1F24" position={[0, 9.8, 0]} />
        <Box args={[30.5, 2.6, 41.9]} color="#0E0F11" position={[0, 11.9, 0.63]} />
        <Screen size={[28, 35]} texture={lcd} position={[0, 13.25, 0.63]} rotation={[-Math.PI / 2, 0, 0]} />
      </group>

      {/* the LaunchPad plugs in from underneath. The footprint is on the back side, so the
          LaunchPad's top faces the bench: flipped, then turned so its USB end is at the left */}
      <group position={[kx(109.04), 11, kz(88.64)]} rotation={[0, -Math.PI / 2, 0]}>
        <group rotation={[Math.PI, 0, 0]}>
          <LaunchPadKit />
        </group>
      </group>
    </group>
  );
}

export function LaunchPad({ playing }: { playing: boolean }) {
  return (
    <group scale={MM}>
      <CustomBoard playing={playing} />
    </group>
  );
}

/* ---------- clipboard with a resume ---------- */

/* ---------- phone: lock screen with my photo ---------- */

export function Phone() {
  const photo = useMemo(() => {
    const img = new Image();
    img.src = '/lab/headshot.jpg';
    return img;
  }, []);

  const screen = useCanvasTexture(120, 240, (g) => {
    g.fillStyle = '#1B2A44';
    g.fillRect(0, 0, 120, 240);
    g.fillStyle = '#2F6470';
    g.fillRect(0, 150, 120, 90);
    const now = new Date();
    g.fillStyle = '#F7F5F0';
    g.textAlign = 'center';
    g.font = 'bold 26px monospace';
    g.fillText(`${now.getHours() % 12 || 12}:${String(now.getMinutes()).padStart(2, '0')}`, 60, 42);
    g.font = '9px monospace';
    g.fillText(now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }), 60, 56);
    if (photo.complete && photo.naturalWidth) {
      g.save();
      g.beginPath();
      g.arc(60, 104, 32, 0, Math.PI * 2);
      g.clip();
      g.drawImage(photo, 28, 72, 64, 64);
      g.restore();
    }
    g.strokeStyle = '#F7F5F0';
    g.lineWidth = 2;
    g.beginPath();
    g.arc(60, 104, 33, 0, Math.PI * 2);
    g.stroke();
    g.fillStyle = '#F7F5F0';
    g.fillRect(10, 172, 100, 40);
    g.fillStyle = '#1D2127';
    g.textAlign = 'left';
    g.font = 'bold 10px monospace';
    g.fillText('About me', 18, 188);
    g.font = '8px monospace';
    g.fillStyle = '#5B6270';
    g.fillText('Tap to open', 18, 202);
    g.fillStyle = '#F7F5F0';
    g.fillRect(42, 228, 36, 3);
  }, 1000);

  return (
    <group>
      <Box args={[0.25, 0.022, 0.48]} color="#1D2127" position={[0, 0.011, 0]} />
      <Screen size={[0.225, 0.45]} texture={screen} position={[0, 0.0225, 0]} rotation={[-Math.PI / 2, 0, 0]} />
    </group>
  );
}

export function Clipboard() {
  const page = useCanvasTexture(192, 258, (g) => {
    g.setTransform(2, 0, 0, 2, 0, 0);
    g.fillStyle = '#FBFAF6';
    g.fillRect(0, 0, 96, 129);
    g.fillStyle = '#1D2127';
    g.font = 'bold 10px monospace';
    g.fillText('Carlos Rojas', 8, 16);
    g.fillStyle = '#5B6270';
    g.font = '6px monospace';
    g.fillText('ECE, UT Austin', 8, 24);
    let y = 34;
    ['Experience', 'Projects', 'Skills'].forEach((h) => {
      g.fillStyle = '#2F6470';
      g.font = 'bold 7px monospace';
      g.fillText(h, 8, y);
      y += 4;
      g.fillStyle = '#C9CCD2';
      for (let i = 0; i < 4; i++) g.fillRect(8, y + i * 5, 58 + ((i * 17) % 22), 2);
      y += 27;
    });
  }, null);

  return (
    <group>
      <Box args={[0.72, 0.02, 0.98]} color="#8B5A33" position={[0, 0.01, 0]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.022, 0.03]} receiveShadow>
        <planeGeometry args={[0.64, 0.86]} />
        <Toon color="#FFFFFF" map={page} />
      </mesh>
      <Box args={[0.3, 0.04, 0.09]} color="#B7BCC2" position={[0, 0.04, -0.43]} />
    </group>
  );
}

/* ---------- props ---------- */

export function Props() {
  const lamp = useMemo(() => {
    const light = new THREE.SpotLight('#FFD39A', 9, 6, 0.8, 0.6, 1.4);
    light.position.set(-2.25, 1.85, -0.75);
    light.target.position.set(-0.5, 1.0, 0.3);
    light.castShadow = true;
    light.shadow.mapSize.set(1024, 1024);
    return light;
  }, []);

  return (
    <group>
      {/* bench-top gear */}
      <ToonModel url="/models/soda-can.glb" size={0.24} position={[-2.75, 1.012, -0.45]} />
      <Cyl args={[0.1, 0.1, 0.07]} color="#8E959E" position={[-0.95, 1.05, -0.95]} />
      <Cyl args={[0.04, 0.04, 0.075]} color="#2A2D33" position={[-0.95, 1.05, -0.95]} />
      <ToonModel url="/models/soldering-station.glb" size={0.62} position={[-3.0, 1.012, 0.5]} rotation={[0, 0.9, 0]} />
      <ToonModel url="/models/multimeter.glb" size={0.38} position={[-0.25, 1.012, 1.35]} rotation={[0, -Math.PI / 2 - 0.25, 0]} />
      <Wire points={[[-0.18, 1.06, 1.22], [-0.02, 1.05, 1.08], [0.14, 1.14, 1.0], [0.22, 1.26, 0.925]]} color="#D94A3D" radius={0.009} />
      <Wire points={[[-0.12, 1.06, 1.26], [0.06, 1.05, 1.14], [0.2, 1.14, 1.03], [0.245, 1.26, 0.92]]} color="#1F2226" radius={0.009} />
      <ToonModel url="/models/headphones.glb" size={0.3} position={[1.35, 1.012, 1.2]} rotation={[0, -0.5, 0]} />
      <ToonModel url="/models/toolbox.glb" size={0.6} position={[2.85, 1.012, -0.1]} rotation={[0, 1.25, 0]} />
      <ToonModel url="/models/desk-lamp.glb" size={0.95} position={[-2.55, 1.012, -1.15]} rotation={[0, 0.55, 0]} />
      <primitive object={lamp} />
      <primitive object={lamp.target} />
      {/* two white Monsters: one fresh, one finished and knocked over */}
      <MonsterCan position={[1.2, 1.012, 0.5]} rotation={[0, -0.6, 0]} />
      <MonsterCan position={[0.95, 1.012 + CAN_R * CAN_SCALE, 1.42]} rotation={[0, 0.7, Math.PI / 2]} lying />
      {/* on the wall */}
      <UTFlag />
      <AlbumOnWall src="/lab/eternal-atake.jpg" position={[2.9, 2.02, -1.7]} tilt={0.05} vinyl={[0.2, 0.14]} labelColor="#7B3FB8" />
      <AlbumOnWall src="/lab/eternal-atake-2.jpg" position={[3.05, 2.8, -1.7]} tilt={-0.07} vinyl={[-0.2, 0.12]} labelColor="#E8C547" />
      {/* on the floor */}
      <ToonModel url="/models/office-chair.glb" size={1.2} position={[-3.0, 0, 2.0]} rotation={[0, 2.6, 0]} />
      <ToonModel url="/models/houseplant.glb" size={1.7} position={[3.75, 0, -1.25]} />
    </group>
  );
}

/* ---------- white Monster can ---------- */

// A 16 oz can, in scene units (the bench is about 7 wide).
const CAN_H = 0.3;
const CAN_R = 0.056;
// Real 16 oz size next to the laptop and scope.
const CAN_SCALE = 1.4;
const BODY_BOTTOM = 0.02;
const BODY_TOP = 0.265;

// Silver profiles, revolved around the can's axis: neck, rolled rim and recessed
// lid on top; a domed base underneath. Points run bottom to top as [radius, height].
const CAN_TOP: [number, number][] = [
  [CAN_R, BODY_TOP], [0.052, 0.28], [0.047, 0.29], [0.0475, 0.296], [0.049, 0.299], [0.046, 0.3], [0.043, 0.296], [0.02, 0.294], [0, 0.294],
];
const CAN_BASE: [number, number][] = [
  [0, 0.013], [0.034, 0.008], [0.046, 0], [0.053, 0.005], [CAN_R, BODY_BOTTOM],
];

function useLathe(profile: [number, number][]) {
  const geometry = useMemo(() => new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), 32), [profile]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return geometry;
}

function MonsterCan({ position, rotation, lying = false }: { position: [number, number, number]; rotation: [number, number, number]; lying?: boolean }) {
  // The label wraps once around the body. Its front (the claw) sits at the
  // canvas center, which lands on the can's local -z side, so the body spins to
  // face the viewer when standing, or face-up when the can lies on its side.
  const spin = lying ? -Math.PI / 2 : Math.PI;
  const label = useCanvasTexture(256, 256, (g) => {
    g.fillStyle = '#F2F2EE';
    g.fillRect(0, 0, 256, 256);
    g.fillStyle = '#C3C8CE';
    g.fillRect(0, 0, 256, 8);
    g.fillRect(0, 248, 256, 8);
    // Claw mark: three jagged, slightly slanted strokes that taper toward the bottom.
    g.fillStyle = '#5E656E';
    [100, 124, 148].forEach((cx, i) => {
      const top = 36 + (i === 1 ? -6 : 0);
      const bottom = 176;
      g.beginPath();
      for (let y = top; y <= bottom; y += 6) {
        const w = 7 - ((y - top) / (bottom - top)) * 4.5;
        const jag = (Math.floor(y / 6) + i) % 2 ? 2.5 : -2.5;
        g.lineTo(cx + (y - top) * 0.08 - w + jag, y);
      }
      for (let y = bottom; y >= top; y -= 6) {
        const w = 7 - ((y - top) / (bottom - top)) * 4.5;
        const jag = (Math.floor(y / 6) + i) % 2 ? -2 : 2;
        g.lineTo(cx + (y - top) * 0.08 + w + jag, y);
      }
      g.closePath();
      g.fill();
    });
    g.fillStyle = '#23262B';
    g.textAlign = 'center';
    g.font = 'bold 26px monospace';
    g.fillText('ULTRA', 128, 214);
    g.font = 'bold 11px monospace';
    g.fillStyle = '#5E656E';
    g.fillText('ZERO SUGAR', 128, 232);
    // Fine print on the back.
    g.fillStyle = '#C9CDD2';
    for (let r = 0; r < 12; r++) {
      g.fillRect(10, 60 + r * 9, 34 - ((r * 7) % 12), 3);
      g.fillRect(212, 60 + r * 9, 34 - ((r * 5) % 12), 3);
    }
  }, null);

  const top = useLathe(CAN_TOP);
  const base = useLathe(CAN_BASE);

  return (
    <group position={position} rotation={rotation} scale={CAN_SCALE}>
      {/* A standing can rests on its base; a lying one pivots around its middle. */}
      <group position={[0, lying ? -CAN_H / 2 : 0, 0]}>
        <mesh position={[0, (BODY_BOTTOM + BODY_TOP) / 2, 0]} rotation={[0, spin, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[CAN_R, CAN_R, BODY_TOP - BODY_BOTTOM, 32, 1, true]} />
          <Toon color="#FFFFFF" map={label} />
        </mesh>
        <mesh geometry={top} castShadow receiveShadow>
          <Toon color="#C3C8CE" side={THREE.DoubleSide} />
        </mesh>
        <mesh geometry={base} castShadow receiveShadow>
          <Toon color="#AEB4BB" side={THREE.DoubleSide} />
        </mesh>
        {/* pull tab */}
        <group position={[0, 0.2965, 0.012]}>
          <Box args={[0.016, 0.003, 0.03]} color="#9EA5AD" cast={false} />
          <mesh position={[0, 0.001, 0.012]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.009, 0.0025, 6, 12]} />
            <Toon color="#9EA5AD" />
          </mesh>
        </group>
      </group>
    </group>
  );
}

/* ---------- wall decor: UT flag and a record ---------- */

const LONGHORN = [
  'X......................X',
  'XX....................XX',
  '.XXX................XXX.',
  '..XXXXX..........XXXXX..',
  '....XXXXXXXXXXXXXXXX....',
  '.......XXXXXXXXXX.......',
  '........XXXXXXXX........',
  '.........XXXXXX.........',
  '.........XXXXXX.........',
  '..........XXXX..........',
  '..........XXXX..........',
  '...........XX...........',
];

function UTFlag() {
  const cloth = useCanvasTexture(96, 64, (g) => {
    g.fillStyle = '#BF5700';
    g.fillRect(0, 0, 96, 64);
    g.fillStyle = '#FFFFFF';
    LONGHORN.forEach((row, y) => {
      for (let x = 0; x < row.length; x++) if (row[x] === 'X') g.fillRect(12 + x * 3, 14 + y * 3, 3, 3);
    });
  }, null);

  // A gentle ripple, pinned along the left edge where the flag hangs from the pole.
  const geometry = useMemo(() => new THREE.PlaneGeometry(1.05, 0.7, 18, 1), []);
  const rest = useMemo(() => Float32Array.from(geometry.attributes.position.array), [geometry]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  useFrame((state) => {
    const pos = geometry.attributes.position;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < pos.count; i++) {
      const x = rest[i * 3];
      const reach = (x + 0.525) / 1.05;
      pos.setZ(i, Math.sin(x * 6 - t * 2.2) * 0.035 * reach);
    }
    pos.needsUpdate = true;
    geometry.computeVertexNormals();
  });

  return (
    <group position={[-3.0, 2.35, -1.66]} rotation={[0, 0, -0.04]}>
      <Cyl args={[0.02, 0.02, 0.9]} color="#8E959E" position={[-0.56, -0.05, 0]} />
      <mesh geometry={geometry} position={[0, 0.05, 0]} castShadow>
        <Toon color="#FFFFFF" map={cloth} />
      </mesh>
    </group>
  );
}

// A record pinned to the wall, vinyl peeking out from behind the sleeve. The sleeve
// shows `src` once it loads, and a drawn placeholder until then (or if it's missing).
function AlbumOnWall({ src, position, tilt, vinyl, labelColor }: {
  src: string;
  position: [number, number, number];
  tilt: number;
  vinyl: [number, number];
  labelColor: string;
}) {
  const placeholder = useCanvasTexture(128, 128, (g) => {
    const grad = g.createLinearGradient(0, 0, 0, 128);
    grad.addColorStop(0, '#1C0F3A');
    grad.addColorStop(1, '#5B2A86');
    g.fillStyle = grad;
    g.fillRect(0, 0, 128, 128);
    g.fillStyle = '#E9E2FF';
    for (let i = 0; i < 40; i++) g.fillRect((i * 53) % 128, (i * 29) % 80, 1, 1);
    g.fillStyle = '#B6F0FF';
    g.beginPath();
    g.ellipse(64, 60, 34, 9, 0, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = '#F7F5F0';
    g.textAlign = 'center';
    g.font = 'bold 14px monospace';
    g.fillText('ETERNAL', 64, 98);
    g.fillText('ATAKE', 64, 114);
  }, null);

  const [cover, setCover] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    let cancelled = false;
    new THREE.TextureLoader().load(
      src,
      (t) => {
        if (cancelled) return t.dispose();
        t.colorSpace = THREE.SRGBColorSpace;
        t.magFilter = THREE.NearestFilter;
        t.minFilter = THREE.NearestFilter;
        t.generateMipmaps = false;
        setCover(t);
      },
      undefined,
      () => {},
    );
    return () => {
      cancelled = true;
    };
  }, [src]);

  return (
    <group position={position} rotation={[0, 0, tilt]}>
      <Cyl args={[0.33, 0.33, 0.01, 32]} color="#141417" position={[vinyl[0], vinyl[1], -0.005]} rotation={[Math.PI / 2, 0, 0]} />
      <Cyl args={[0.1, 0.1, 0.012, 20]} color={labelColor} position={[vinyl[0], vinyl[1], -0.003]} rotation={[Math.PI / 2, 0, 0]} />
      <Box args={[0.72, 0.72, 0.012]} color="#F4F2EC" position={[0, 0, 0.008]} />
      <mesh position={[0, 0, 0.0145]}>
        <planeGeometry args={[0.7, 0.7]} />
        <Toon color="#FFFFFF" map={cover ?? placeholder} />
      </mesh>
      <mesh position={[0, 0.33, 0.04]} castShadow>
        <sphereGeometry args={[0.03, 10, 8]} />
        <Toon color="#D94A3D" />
      </mesh>
    </group>
  );
}

export function ProbeLead() {
  return <Wire points={[[1.3, 1.12, -0.34], [0.9, 1.03, -0.2], [0.55, 1.05, -0.3], [0.37, 1.1, -0.4]]} color="#1F2226" radius={0.012} />;
}
