export const getInitialTheme = () =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

export const getStoredTheme = () => localStorage.getItem('theme');
export const setStoredTheme = (theme: string) => localStorage.setItem('theme', theme);

export const applyTheme = (theme: string) => {
  document.documentElement.setAttribute('data-mode', theme);
};