import { INVADER_SPRITE } from './invaders';

// The one running game. The panel canvas, the panel's controls, and the 3D board all
// read and drive this same object, so the board's LCD always shows the real game.

export const GAME_W = 320;
export const GAME_H = 240;
export const ROW_COLORS = ['#E8C547', '#7FD1E0', '#E07BC8', '#9BE07B'];

export type GameState = 'ready' | 'play' | 'over' | 'win';
export interface Invader { x: number; y: number; row: number; alive: boolean }
export interface Shot { x: number; y: number }

// Whether a pixel of the 11x8 sprite is lit on this animation frame (the legs alternate).
export function spritePixelOn(x: number, y: number, frame: number) {
  if (frame && y === 7) return x === 1 || x === 9 || x === 4 || x === 6;
  return INVADER_SPRITE[y][x] === 'X';
}

class InvadersEngine {
  state: GameState = 'ready';
  paused = true;
  px = GAME_W / 2;
  score = 0;
  lives = 3;
  frame = 0;
  invaders: Invader[] = [];
  shots: Shot[] = [];
  bombs: Shot[] = [];
  input = { left: false, right: false };
  // When Fire was last pressed, in performance.now() time, so the board can show the press.
  firedAt = -Infinity;

  private dir = 1;
  private stepTimer = 0;
  private lastTick = 0;

  constructor() {
    this.reset();
  }

  private reset() {
    this.state = 'ready';
    this.px = GAME_W / 2;
    this.score = 0;
    this.lives = 3;
    this.dir = 1;
    this.stepTimer = 0;
    this.shots = [];
    this.bombs = [];
    this.invaders = [];
    for (let r = 0; r < 4; r++) for (let c = 0; c < 8; c++) this.invaders.push({ x: 34 + c * 30, y: 30 + r * 22, row: r, alive: true });
  }

  fire() {
    this.firedAt = performance.now();
    if (this.state !== 'play') {
      this.reset();
      this.state = 'play';
      return;
    }
    if (this.shots.length < 2) this.shots.push({ x: this.px, y: GAME_H - 26 });
  }

  // A closed panel pauses a game in progress, and lets go of any held direction.
  setPaused(paused: boolean) {
    this.paused = paused;
    this.input.left = false;
    this.input.right = false;
  }

  // Safe to call from several render loops: time only advances once per moment.
  tick(now: number) {
    const dt = Math.min(0.05, (now - (this.lastTick || now)) / 1000);
    this.lastTick = now;
    if (dt <= 0) return;
    if (this.state === 'ready') this.march(dt, false);
    else if (this.state === 'play' && !this.paused) this.update(dt);
  }

  // Steps the formation side to side. On the title screen it stays on its rows and drops no bombs.
  private march(dt: number, playing: boolean) {
    const alive = this.invaders.filter((i) => i.alive);
    this.stepTimer += dt;
    if (this.stepTimer <= Math.max(0.08, 0.5 * (alive.length / 32))) return;
    this.stepTimer = 0;
    this.frame ^= 1;
    const xs = alive.map((i) => i.x);
    if ((this.dir > 0 && Math.max(...xs) > GAME_W - 26) || (this.dir < 0 && Math.min(...xs) < 8)) {
      this.dir *= -1;
      if (playing) alive.forEach((i) => (i.y += 8));
    } else {
      alive.forEach((i) => (i.x += 5 * this.dir));
    }
    if (playing && alive.length && Math.random() < 0.5) {
      const s = alive[Math.floor(Math.random() * alive.length)];
      this.bombs.push({ x: s.x + 9, y: s.y + 14 });
    }
  }

  private update(dt: number) {
    const move = (this.input.left ? -1 : 0) + (this.input.right ? 1 : 0);
    this.px = Math.max(12, Math.min(GAME_W - 12, this.px + move * 150 * dt));
    this.shots.forEach((s) => (s.y -= 260 * dt));
    this.shots = this.shots.filter((s) => s.y > -10);
    this.bombs.forEach((b) => (b.y += 110 * dt));

    this.march(dt, true);

    const alive = this.invaders.filter((i) => i.alive);
    this.shots.forEach((s) => {
      alive.forEach((i) => {
        if (i.alive && s.x > i.x && s.x < i.x + 18 && s.y > i.y && s.y < i.y + 13) {
          i.alive = false;
          s.y = -99;
          this.score += 10 * (4 - i.row);
        }
      });
    });
    this.bombs = this.bombs.filter((b) => {
      if (b.y > GAME_H - 24 && b.y < GAME_H - 12 && Math.abs(b.x - this.px) < 11) {
        this.lives -= 1;
        if (this.lives <= 0) this.state = 'over';
        return false;
      }
      return b.y < GAME_H;
    });
    if (!this.invaders.some((i) => i.alive)) this.state = 'win';
    if (alive.some((i) => i.alive && i.y > GAME_H - 40)) this.state = 'over';
  }
}

export const game = new InvadersEngine();
