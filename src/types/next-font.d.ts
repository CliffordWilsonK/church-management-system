declare module '@next/font/google' {
  const Inter: (config: {
    subsets: string[];
    variable?: string;
    display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
  }) => {
    className: string;
    variable: string;
    style: { fontFamily: string };
  };

  const Montserrat: (config: {
    subsets: string[];
    variable?: string;
    display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
  }) => {
    className: string;
    variable: string;
    style: { fontFamily: string };
  };

  export { Inter, Montserrat };
} 