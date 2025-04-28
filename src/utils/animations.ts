
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

export const pulse = `animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]`;
