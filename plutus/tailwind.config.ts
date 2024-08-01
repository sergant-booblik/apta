import type { Config } from 'tailwindcss';

export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  darkMode: ['class', '[data-mode="dark"]'],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    fontFamily: {
      sans: ['Roboto', 'sans-serif'],
      serif: ['Lora', 'serif'],
    },
    extend: {},
  },
  plugins: [],
} satisfies Config;

