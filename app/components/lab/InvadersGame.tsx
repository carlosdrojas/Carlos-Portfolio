'use client';

import { useEffect, useRef } from 'react';
import { INVADER_SPRITE } from './invaders';
import { GAME_H as H, GAME_W as W, ROW_COLORS, game, spritePixelOn, type GameState } from './invadersEngine';

// Browser stand-in for the MSPM0 Space Invaders build. The game itself lives in
// invadersEngine; this is the panel's view of it, plus its keyboard and on-screen controls.
export default function InvadersGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const g = canvasRef.current?.getContext('2d');
    if (!g) return;

    const text = (t: string, x: number, y: number, size: number, color: string, align: CanvasTextAlign = 'left') => {
      g.fillStyle = color;
      g.font = `${size}px monospace`;
      g.textAlign = align;
      g.fillText(t, x, y);
    };

    const draw = () => {
      g.fillStyle = '#050607';
      g.fillRect(0, 0, W, H);
      text(`SCORE ${game.score}`, 8, 14, 10, '#C9CED6');
      text(`LIVES ${game.lives}`, W - 8, 14, 10, '#C9CED6', 'right');
      game.invaders.forEach((inv) => {
        if (!inv.alive) return;
        g.fillStyle = ROW_COLORS[inv.row];
        INVADER_SPRITE.forEach((row, y) => {
          for (let x = 0; x < row.length; x++) {
            if (spritePixelOn(x, y, game.frame)) g.fillRect(Math.round(inv.x + x * 1.6), Math.round(inv.y + y * 1.6), 2, 2);
          }
        });
      });
      g.fillStyle = '#EDEFF2';
      g.fillRect(game.px - 10, H - 18, 20, 6);
      g.fillRect(game.px - 2, H - 22, 4, 4);
      g.fillStyle = '#FFFFFF';
      game.shots.forEach((s) => g.fillRect(s.x - 1, s.y, 2, 7));
      g.fillStyle = '#FF7A66';
      game.bombs.forEach((b) => g.fillRect(b.x - 1, b.y, 2, 6));
      g.fillStyle = '#2E7D5B';
      g.fillRect(0, H - 8, W, 2);
      const banner: Record<Exclude<GameState, 'play'>, [string, string, string]> = {
        ready: ['SPACE INVADERS', '#E8C547', 'press Fire to start'],
        over: ['GAME OVER', '#FF7A66', 'press Fire to play again'],
        win: ['BOARD CLEARED', '#9BE07B', 'press Fire to play again'],
      };
      if (game.state !== 'play') {
        const [title, color, sub] = banner[game.state];
        text(title, W / 2, H / 2 + 6, 16, color, 'center');
        text(sub, W / 2, H / 2 + 26, 10, '#C9CED6', 'center');
      }
    };

    const onDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT') return;
      if (['ArrowLeft', 'a', 'A'].includes(e.key)) { game.input.left = true; e.preventDefault(); }
      if (['ArrowRight', 'd', 'D'].includes(e.key)) { game.input.right = true; e.preventDefault(); }
      if (e.key === ' ' || e.key === 'ArrowUp') { game.fire(); e.preventDefault(); }
    };
    const onUp = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'a', 'A'].includes(e.key)) game.input.left = false;
      if (['ArrowRight', 'd', 'D'].includes(e.key)) game.input.right = false;
    };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);

    game.setPaused(false);
    let raf = 0;
    const loop = (t: number) => {
      game.tick(t);
      draw();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
      game.setPaused(true);
    };
  }, []);

  const hold = (k: 'left' | 'right') => ({
    onPointerDown: (e: React.PointerEvent) => { e.preventDefault(); game.input[k] = true; },
    onPointerUp: () => { game.input[k] = false; },
    onPointerLeave: () => { game.input[k] = false; },
    onPointerCancel: () => { game.input[k] = false; },
  });

  const btn = 'flex-1 min-w-[72px] py-3 font-pixel text-sm border-2 border-[#1D2127] shadow-[3px_3px_0_#1D2127] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none';

  return (
    <div className="flex flex-col gap-3">
      <div className="bg-[#0E1114] p-3 border-2 border-[#1D2127]">
        <canvas ref={canvasRef} width={W} height={H} aria-label="Space Invaders game" className="block w-full aspect-[4/3] [image-rendering:pixelated]" />
      </div>
      <div className="flex gap-2">
        <button type="button" className={`${btn} bg-[#2A3038] text-[#EDEFF2]`} aria-label="Move left" {...hold('left')}>Left</button>
        <button type="button" className={`${btn} bg-[#E8C547] text-[#1D2127]`} onClick={() => game.fire()}>Fire</button>
        <button type="button" className={`${btn} bg-[#2A3038] text-[#EDEFF2]`} aria-label="Move right" {...hold('right')}>Right</button>
      </div>
      <p className="text-sm text-[#5B6270] leading-relaxed">Arrow keys or A and D to move, space to fire. You can also click the buttons on the board: LEFT and RGHT move, UP and DOWN fire.</p>
    </div>
  );
}
