
export type AnimationType = 'shimmer' | 'pulse' | 'fade' | 'wave';

// Base animation keyframes are defined in index.css

// Shimmer effect
export const shimmer = `
  after:absolute
  after:content-['']
  after:bg-gradient-to-r
  after:from-transparent
  after:via-white/10
  after:to-transparent
  after:-translate-x-full
  after:animate-[shimmer_2s_infinite]
  overflow-hidden
  relative
`;

// Pulse animation
export const pulse = `animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]`;

// Fade animation
export const fade = `animate-[fade_1.5s_ease-in-out_infinite]`;

// Wave animation
export const wave = `animate-[wave_1.5s_ease-in-out_infinite]`;

export const getAnimation = (type: AnimationType = 'shimmer'): string => {
  switch (type) {
    case 'pulse':
      return pulse;
    case 'fade':
      return fade;
    case 'wave':
      return wave;
    default:
      return shimmer;
  }
};
