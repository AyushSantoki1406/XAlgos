export type Theme = {
    theme: 'light' | 'dark';
    color: string;
    background: string;
  };
  
  const theme = {
    light: {
      theme: 'light',
      color: '#FFFFFF',
      background: '#FFFFFF',
    },
    dark: {
      theme: 'dark',
      color: '#000000',
      background: '#000000',
    },
  } as const;
  
  export default theme;
  