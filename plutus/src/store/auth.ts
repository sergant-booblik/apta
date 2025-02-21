import { defineStore } from 'pinia';
import { useProfileStore } from '@/store/profile'
import { api } from '@/api';
import type { VerifyTokenResponse } from '@/api/auth'
import type { ErrorData } from '@/types/error';


interface AuthState {
  isAuth: boolean,
  errors: Record<string, ErrorData[]> | undefined;
  loading: boolean,
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    isAuth: false,
    errors: undefined,
    loading: false,
  }),
  actions: {
    initialize() {
      const profileStore = useProfileStore();

      return new Promise((resolve, reject) => {
        this.verifyToken()
          .then((result: VerifyTokenResponse) => {
            if (result?.success) {
              return resolve(profileStore.fetchUser());
            } else {
              return resolve(this.refreshToken().then(() => profileStore.fetchUser()));
            }
          }).catch((error) => {
          this.logout();
          return reject(error);
        });
      });
    },
    async verifyToken(): Promise<VerifyTokenResponse> {
      return new Promise((resolve, reject) => {
        this.loading = true;
        api.verifyToken()
          .then((response: VerifyTokenResponse) => {
            this.isAuth = response.success;
            resolve(response);
          }).catch((error) => reject(error))
          .finally(() => {
            this.loading = false;
          });
      });
    },
    async refreshToken() {
      return new Promise((resolve, reject) => {
        this.loading = true;
        api.refreshToken()
          .then((result) => resolve(result))
          .catch((error) => reject(error));
      });
    },
    async login(email: string, password: string) {
      return new Promise((resolve, reject) => {
        this.loading = true;
        api.login({ email, password })
          .then((response) => {
            this.isAuth = true;

            resolve(response);
          })
          .catch((response) => {
            this.errors = response.error;
            reject(response);
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },
    async logout() {
      const profileStore = useProfileStore();
      return new Promise((resolve) => {
        api.logout().then(() => {
          this.isAuth = false;
          profileStore.clearUser();
        });
        resolve(true);
      });
    },
    clearError() {
      this.errors = undefined;
    },
  }
});
