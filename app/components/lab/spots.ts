export type SpotId = 'pegboard' | 'laptop' | 'scope' | 'launchpad' | 'clipboard';

export const SPOT_ORDER: SpotId[] = ['pegboard', 'laptop', 'scope', 'launchpad', 'clipboard'];

export const SPOTS: Record<SpotId, { name: string; role: string; title: string; sub: string }> = {
  pegboard: { name: 'Pegboard', role: 'Projects', title: 'Projects', sub: 'Everything pinned up over the bench.' },
  laptop: { name: 'Laptop', role: 'Shell', title: 'Yash', sub: 'A browser copy of the Unix shell I wrote in C. Type help.' },
  scope: { name: 'Oscilloscope', role: 'Experience', title: 'Experience', sub: 'One channel per role, newest first.' },
  launchpad: { name: 'LaunchPad', role: 'Play', title: 'Space Invaders', sub: 'The original runs in C and Assembly on this board.' },
  clipboard: { name: 'Clipboard', role: 'About and contact', title: 'About me', sub: 'Background, skills, and how to reach me.' },
};

// Camera framing for each object, in that object's local coordinates.
export const VIEWS: Record<SpotId, { pos: [number, number, number]; look: [number, number, number] }> = {
  pegboard: { pos: [0, 0.05, 4.3], look: [0, 0, 0] },
  laptop: { pos: [0, 0.85, 1.6], look: [0, 0.42, -0.5] },
  scope: { pos: [0, 0.7, 2.9], look: [0, 0.45, 0.4] },
  launchpad: { pos: [0.1, 1.3, 0.7], look: [0.1, 0.1, 0] },
  clipboard: { pos: [0, 1.55, 0.6], look: [0, 0.02, 0.02] },
};

// Scope channel colors, shared by the 3D screen and the Experience panel.
export const CHANNEL_COLORS = ['#F2D43D', '#4CC9E6', '#E870D0'];

// Short names the scope traces write out, in the same order as data/experience.ts.
export const CHANNEL_LABELS = ['AMAZON', 'UT RSOC', 'UTSA'];
