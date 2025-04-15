import { watch } from 'vue';
import { useProfileStore } from '@/store/profile';
import {
  getInitialTheme,
  getStoredTheme,
  setStoredTheme,
  applyTheme,
} from '@/logic/theme';

export function useTheme() {
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
    { immediate: true }
  );

  function toggleTheme() {
    const current = getStoredTheme() ?? 'light';
    const next = current === 'dark' ? 'light' : 'dark';

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