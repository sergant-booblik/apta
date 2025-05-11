import { watch } from 'vue';
import { useProfileStore } from '@/store/profile';
import { applyTheme, getInitialTheme, getStoredTheme, setStoredTheme } from '@/logic/theme';
import { Theme } from '@/types/profile';

export function useTheme(): {
  toggleTheme: () => void,
} {
  const profileStore = useProfileStore();

  const initialTheme = profileStore.profile?.theme || getStoredTheme() || getInitialTheme();
  applyTheme(initialTheme);
  setStoredTheme(initialTheme);

  watch(
    () => profileStore.profile?.theme,
    (newTheme) => {
      if (newTheme) {
        setStoredTheme(newTheme);
        applyTheme(newTheme);
      }
    },
    { immediate: true },
  );

  function toggleTheme(): void {
    const current = getStoredTheme() ?? Theme.LIGHT;
    const next = current === Theme.DARK ? Theme.LIGHT : Theme.DARK;

    setStoredTheme(next);
    applyTheme(next);

    if (profileStore.profile) {
      profileStore.updateProfile({
        ...profileStore.profile,
        theme: next,
      });
    }
  }

  return {
    toggleTheme,
  };
}