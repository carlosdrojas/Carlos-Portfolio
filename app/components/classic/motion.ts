// Critically damped by default (no overshoot), per the redesign's motion spec.
export const spring = { type: 'spring', bounce: 0, duration: 0.4 } as const;

// Short cross-fade used in place of movement when reduced motion is on.
export const fade = { duration: 0.2, ease: 'easeOut' } as const;
