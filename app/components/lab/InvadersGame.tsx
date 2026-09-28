'use client';

import { useEffect, useRef } from 'react';
import { INVADER_SPRITE } from './invaders';

const W = 320;
const H = 240;
const ROW_COLORS = ['#E8C547', '#7FD1E0', '#E07BC8', '#9BE07B'];

type State = 'ready' | 'play' | 'over' | 'win';
interface Invader { x: number; y: number; row: number; alive: boolean }
interface Shot { x: number; y: number }

// Browser stand-in for the MSPM0 Space Invaders build.
export default function InvadersGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keys = useRef({ left: false, right: false });
  const fireRef = useRef<() => void>(() => {});

  useEffect(() => {
    const g = canvasRef.current?.getContext('2d');
    if (!g) return;

    let state: State = 'ready';
    let px = W / 2;
    let score = 0;
    let lives = 3;
    let dir = 1;
    let stepTimer = 0;
    let frame = 0;
    let invaders: Invader[] = [];
    let shots: Shot[] = [];
    let bombs: Shot[] = [];

    const reset = () => {
      state = 'ready';
      px = W / 2;
      score = 0;
      lives = 3;
      dir = 1;
      shots = [];
      bombs = [];
      invaders = [];
      for (let r = 0; r < 4; r++) for (let c = 0; c < 8; c++) invaders.push({ x: 34 + c * 30, y: 30 + r * 22, row: r, alive: true });
    };

    const fire = () => {
      if (state !== 'play') {
        if (state !== 'ready') reset();
        state = 'play';
        return;
      }
      if (shots.length < 2) shots.push({ x: px, y: H - 26 });
    };
    fireRef.current = fire;

    const update = (dt: number) => {
      if (state !== 'play') return;
      const move = (keys.current.left ? -1 : 0) + (keys.current.right ? 1 : 0);
      px = Math.max(12, Math.min(W - 12, px + move * 150 * dt));
      shots.forEach((s) => (s.y -= 260 * dt));
      shots = shots.filter((s) => s.y > -10);
      bombs.forEach((b) => (b.y += 110 * dt));

      const alive = invaders.filter((i) => i.alive);
      stepTimer += dt;
      if (stepTimer > Math.max(0.08, 0.5 * (alive.length / 32))) {
        stepTimer = 0;
        frame ^= 1;
        const xs = alive.map((i) => i.x);
        if ((dir > 0 && Math.max(...xs) > W - 26) || (dir < 0 && Math.min(...xs) < 8)) {
          dir *= -1;
          alive.forEach((i) => (i.y += 8));
        } else {
          alive.forEach((i) => (i.x += 5 * dir));
        }
        if (alive.length && Math.random() < 0.5) {
          const s = alive[Math.floor(Math.random() * alive.length)];
          bombs.push({ x: s.x + 9, y: s.y + 14 });
        }
      }

      shots.forEach((s) => {
        alive.forEach((i) => {
          if (i.alive && s.x > i.x && s.x < i.x + 18 && s.y > i.y && s.y < i.y + 13) {
            i.alive = false;
            s.y = -99;
            score += 10 * (4 - i.row);
          }
        });
      });
      bombs = bombs.filter((b) => {
        if (b.y > H - 24 && b.y < H - 12 && Math.abs(b.x - px) < 11) {
          lives -= 1;
          if (lives <= 0) state = 'over';
          return false;
        }
        return b.y < H;
      });
      if (!invaders.some((i) => i.alive)) state = 'win';
      if (alive.some((i) => i.y > H - 40)) state = 'over';
    };

    const text = (t: string, x: number, y: number, size: number, color: string, align: CanvasTextAlign = 'left') => {
      g.fillStyle = color;
      g.font = `${size}px monospace`;
      g.textAlign = align;
      g.fillText(t, x, y);
    };

    const draw = () => {
      g.fillStyle = '#050607';
      g.fillRect(0, 0, W, H);
      text(`SCORE ${score}`, 8, 14, 10, '#C9CED6');
      text(`LIVES ${lives}`, W - 8, 14, 10, '#C9CED6', 'right');
      invaders.forEach((inv) => {
        if (!inv.alive) return;
        g.fillStyle = ROW_COLORS[inv.row];
        INVADER_SPRITE.forEach((row, y) => {
          for (let x = 0; x < row.length; x++) {
            let on = row[x] === 'X';
            if (frame && y === 7) on = x === 1 || x === 9 || x === 4 || x === 6;
            if (on) g.fillRect(Math.round(inv.x + x * 1.6), Math.round(inv.y + y * 1.6), 2, 2);
          }
        });
      });
      g.fillStyle = '#EDEFF2';
      g.fillRect(px - 10, H - 18, 20, 6);
      g.fillRect(px - 2, H - 22, 4, 4);
      g.fillStyle = '#FFFFFF';
      shots.forEach((s) => g.fillRect(s.x - 1, s.y, 2, 7));
      g.fillStyle = '#FF7A66';
      bombs.forEach((b) => g.fillRect(b.x - 1, b.y, 2, 6));
      g.fillStyle = '#2E7D5B';
      g.fillRect(0, H - 8, W, 2);
      const banner: Record<Exclude<State, 'play'>, [string, string, string]> = {
        ready: ['SPACE INVADERS', '#E8C547', 'press Fire to start'],
        over: ['GAME OVER', '#FF7A66', 'press Fire to play again'],
        win: ['BOARD CLEARED', '#9BE07B', 'press Fire to play again'],
      };
      if (state !== 'play') {
        const [title, color, sub] = banner[state];
        text(title, W / 2, H / 2 + 6, 16, color, 'center');
        text(sub, W / 2, H / 2 + 26, 10, '#C9CED6', 'center');
      }
    };

    const onDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT') return;
      if (['ArrowLeft', 'a', 'A'].includes(e.key)) { keys.current.left = true; e.preventDefault(); }
      if (['ArrowRight', 'd', 'D'].includes(e.key)) { keys.current.right = true; e.preventDefault(); }
      if (e.key === ' ' || e.key === 'ArrowUp') { fire(); e.preventDefault(); }
    };
    const onUp = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'a', 'A'].includes(e.key)) keys.current.left = false;
      if (['ArrowRight', 'd', 'D'].includes(e.key)) keys.current.right = false;
    };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);

    reset();
    let raf = 0;
    let last = 0;
    const loop = (t: number) => {
      const dt = Math.min(0.05, (t - (last || t)) / 1000);
      last = t;
      update(dt);
      draw();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
  }, []);

  const hold = (k: 'left' | 'right') => ({
    onPointerDown: (e: React.PointerEvent) => { e.preventDefault(); keys.current[k] = true; },
    onPointerUp: () => { keys.current[k] = false; },
    onPointerLeave: () => { keys.current[k] = false; },
    onPointerCancel: () => { keys.current[k] = false; },
  });

  const btn = 'flex-1 min-w-[72px] py-3 font-pixel text-sm border-2 border-[#1D2127] shadow-[3px_3px_0_#1D2127] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none';

  return (
    <div className="flex flex-col gap-3">
      <div className="bg-[#0E1114] p-3 border-2 border-[#1D2127]">
        <canvas ref={canvasRef} width={W} height={H} aria-label="Space Invaders game" className="block w-full aspect-[4/3] [image-rendering:pixelated]" />
      </div>
      <div className="flex gap-2">
        <button type="button" className={`${btn} bg-[#2A3038] text-[#EDEFF2]`} aria-label="Move left" {...hold('left')}>Left</button>
        <button type="button" className={`${btn} bg-[#E8C547] text-[#1D2127]`} onClick={() => fireRef.current()}>Fire</button>
        <button type="button" className={`${btn} bg-[#2A3038] text-[#EDEFF2]`} aria-label="Move right" {...hold('right')}>Right</button>
      </div>
      <p className="text-sm text-[#5B6270] leading-relaxed">Arrow keys or A and D to move, space to fire.</p>
    </div>
  );
}
