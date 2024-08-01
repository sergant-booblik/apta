import { defineStore } from 'pinia';
import { useUserStore } from '@/store/user';
import { api } from '@/api';
import type { AuthResponse } from '@/api/auth';
import {useRouter} from "vue-router";

interface AuthState {
  isAuth: boolean,
  error: string | undefined,
  loading: boolean,
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    isAuth: false,
    error: undefined,
    loading: false,
  }),
  actions: {
    async authUser() {
      const userStore = useUserStore();
      return new Promise((resolve, reject) => {
        this.loading = true;
        api.auth()
          .then((response: AuthResponse) => {
            this.isAuth = !!(response.id && response.email);
            userStore.setProfile({
              id: response.id,
              email: response.email,
              name: response.name,
            });
            userStore.setSettings({
              locale: response.locale,
              currencies: response.currencies,
              defaultCurrency: response.defaultCurrency,
            });
            resolve(response);
          }).catch((error) => reject(error))
          .finally(() => {
            this.loading = false;
          });
      });
    },
    async login(email: string, password: string) {
      const userStore = useUserStore();
      return new Promise((resolve, reject) => {
        this.loading = true;
        api.login({ email, password })
          .then((response) => {
            this.isAuth = true;
            userStore.setProfile({
              id: response.id,
              email: response.email,
              name: response.name,
            });

            resolve(response);
          })
          .catch((response) => {
            this.error = response.error;
            reject(response);
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },
    clearError() {
      this.error = undefined;
    },
  }
});
