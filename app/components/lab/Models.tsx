'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { projects } from '../../data/projects';
import { Box, Cyl, Screen, Toon, ToonModel, Wire, useCanvasTexture } from './toon';
import { CHANNEL_COLORS, CHANNEL_LABELS } from './spots';
import { INVADER_SPRITE } from './invaders';

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
const PHOTO_URLS = [...PINNED.map((p) => thumb(p.image)), '/lab/me.jpg'];

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
      {/* a screwdriver on a hook, a spare board, and a coil of wire */}
      <Cyl args={[0.012, 0.012, 0.12]} color="#8E959E" position={[2.15, -0.28, 0.06]} rotation={[Math.PI / 2, 0, 0]} />
      <ToonModel url="/models/screwdriver.glb" size={0.42} position={[2.15, -0.72, 0.06]} rotation={[-Math.PI / 2, 0, 0]} />
      <ToonModel url="/models/circuit-board.glb" size={0.5} position={[-2.08, -0.72, 0.03]} rotation={[0, 0, 0.06]} />
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

/* ---------- MSPM0 LaunchPad with an LCD running invaders ---------- */

export function LaunchPad() {
  const lcd = useCanvasTexture(96, 72, (g, ms) => {
    g.fillStyle = '#050607';
    g.fillRect(0, 0, 96, 72);
    const step = Math.floor(ms / 180);
    const swing = Math.abs((step % 12) - 6);
    const cols = ['#E8C547', '#7FD1E0', '#E07BC8'];
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 5; c++) {
        g.fillStyle = cols[r];
        INVADER_SPRITE.forEach((row, y) => {
          for (let x = 0; x < row.length; x++) if (row[x] === 'X') g.fillRect(8 + c * 16 + swing + x, 6 + r * 11 + y, 1, 1);
        });
      }
    }
    const px = Math.round(48 + Math.sin(step * 0.35) * 24);
    g.fillStyle = '#EDEFF2';
    g.fillRect(px - 4, 64, 9, 3);
    g.fillRect(px - 1, 62, 3, 2);
    if (step % 4 < 2) {
      g.fillStyle = '#FFFFFF';
      g.fillRect(px, 44 + (step % 4) * 8, 1, 4);
    }
  }, 180);

  return (
    <group>
      <Box args={[0.95, 0.03, 0.52]} color="#C7303A" position={[0, 0.015, 0]} />
      {Array.from({ length: 10 }, (_, i) => (
        <group key={i}>
          <Box args={[0.035, 0.07, 0.035]} color="#15171A" position={[-0.38 + i * 0.05, 0.065, -0.23]} />
          <Box args={[0.035, 0.07, 0.035]} color="#15171A" position={[-0.38 + i * 0.05, 0.065, 0.23]} />
        </group>
      ))}
      <Box args={[0.5, 0.02, 0.4]} color="#1D3F7A" position={[0.12, 0.11, 0]} />
      <Box args={[0.42, 0.012, 0.32]} color="#0E0F11" position={[0.12, 0.126, 0]} />
      <Screen size={[0.38, 0.285]} texture={lcd} position={[0.12, 0.133, 0]} rotation={[-Math.PI / 2, 0, 0]} />
      <Box args={[0.1, 0.04, 0.08]} color="#C9CED6" position={[-0.45, 0.05, 0]} />
      <Box args={[0.1, 0.012, 0.1]} color="#1F2226" position={[-0.25, 0.036, -0.08]} />
      {[-0.3, -0.2].map((x) => (
        <Cyl key={x} args={[0.022, 0.022, 0.02]} color="#E6E6E6" position={[x, 0.04, 0.12]} />
      ))}
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
      <Wire points={[[-0.18, 1.06, 1.22], [-0.05, 1.05, 0.95], [0.08, 1.05, 0.75], [0.14, 1.1, 0.62]]} color="#D94A3D" radius={0.009} />
      <Wire points={[[-0.12, 1.06, 1.26], [0.12, 1.05, 1.05], [0.25, 1.1, 0.88]]} color="#1F2226" radius={0.009} />
      <ToonModel url="/models/headphones.glb" size={0.3} position={[1.35, 1.012, 1.2]} rotation={[0, -0.5, 0]} />
      <ToonModel url="/models/toolbox.glb" size={0.6} position={[2.85, 1.012, -0.1]} rotation={[0, 1.25, 0]} />
      <ToonModel url="/models/desk-lamp.glb" size={0.95} position={[-2.55, 1.012, -1.15]} rotation={[0, 0.55, 0]} />
      <primitive object={lamp} />
      <primitive object={lamp.target} />
      {/* two white Monsters: one fresh, one finished and knocked over */}
      <MonsterCan position={[1.18, 1.012, 0.5]} rotation={[0, -0.6, 0]} />
      <MonsterCan position={[0.95, 1.012 + 0.056, 1.42]} rotation={[0, 0.7, Math.PI / 2]} lying />
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

const CAN_H = 0.3;
const CAN_R = 0.056;

function MonsterCan({ position, rotation, lying = false }: { position: [number, number, number]; rotation: [number, number, number]; lying?: boolean }) {
  // The label's claw mark wraps to the can's local -z side; spin it toward the
  // viewer when standing, or face-up when the can lies on its side.
  const spin = lying ? -Math.PI / 2 : Math.PI;
  // Wraps around the can: white body with a silver claw mark on the front.
  const label = useCanvasTexture(128, 96, (g) => {
    g.fillStyle = '#F4F4F1';
    g.fillRect(0, 0, 128, 96);
    g.fillStyle = '#B9BEC4';
    g.fillRect(0, 0, 128, 4);
    g.fillRect(0, 92, 128, 4);
    // three jagged claw strokes
    g.fillStyle = '#8E959E';
    [44, 60, 76].forEach((x0, i) => {
      for (let y = 18; y < 70; y += 2) {
        const jag = ((y / 2 + i) % 3) - 1;
        g.fillRect(x0 + jag + Math.round((y - 18) * 0.05), y, 5, 2);
      }
    });
    g.fillStyle = '#5B6270';
    g.font = 'bold 9px monospace';
    g.textAlign = 'center';
    g.fillText('ULTRA', 64, 84);
  }, null);

  // The can's own origin is its base center; lying cans pivot around their middle.
  const lift = lying ? 0 : CAN_H / 2;
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, lift, 0]} rotation={[0, spin, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[CAN_R, CAN_R, CAN_H, 20]} />
        <Toon color="#FFFFFF" map={label} />
      </mesh>
      <Cyl args={[CAN_R * 0.9, CAN_R, 0.014, 20]} color="#B9BEC4" position={[0, lift + CAN_H / 2 + 0.007, 0]} />
      <Box args={[0.03, 0.004, 0.018]} color="#8E959E" position={[0, lift + CAN_H / 2 + 0.016, 0.012]} cast={false} />
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
