import { Theme } from '@/types/profile';

export const getInitialTheme = (): Theme =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? Theme.DARK : Theme.LIGHT;

export const getStoredTheme = (): Theme | undefined => localStorage.getItem('theme') as Theme | undefined;
export const setStoredTheme = (theme: string): void => localStorage.setItem('theme', theme);

export const applyTheme = (theme: string): void => {
  document.documentElement.setAttribute('data-mode', theme);
};