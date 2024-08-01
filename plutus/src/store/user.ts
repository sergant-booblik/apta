import { defineStore } from 'pinia';
import { api } from '@/api';
import type { Profile } from '@/types/profile';
import type { Settings } from '@/types/settings';

interface UserState {
  profile: Profile | undefined,
  settings: Settings | undefined,
  loading: boolean,
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    profile: undefined,
    settings: undefined,
    loading: false,
  }),
  actions: {
    async setProfile(profile: Profile) {
      this.profile = profile;
    },
    setSettings(settings: Settings) {
      this.settings = settings;
    },
    async updateSettings(
      id: number,
      settings: Settings,
    ) {
      return new Promise((resolve, reject) => {
        this.loading = true;
        api.updateSettings({ id, settings })
          .then((response) => {
            this.setSettings({
              locale: response.locale,
              currencies: response.currencies,
              defaultCurrency: response.defaultCurrency,
            });

            resolve(response);
          })
          .catch((error) => reject(error))
          .finally(() => {
            this.loading = false;
          });
      });
    }
  },
});
