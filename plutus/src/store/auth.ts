import { defineStore } from 'pinia';
import { useProfileStore } from '@/store/profile'
import { api } from '@/api';
import type { RefreshTokenResponse, VerifyTokenResponse } from '@/api/auth'
import type { ErrorData } from '@/types/error';
import { RouteName } from '@/router';
import type { LoginResponse } from '@/api/login'
import type { Router } from 'vue-router'


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
    async verifyToken(): Promise<VerifyTokenResponse> {
      this.loading = true;
      try {
        const response = await api.verifyToken();
        this.isAuth = response.success;
        return response;
      } finally {
        this.loading = false;
      }
    },
    async refreshToken(): Promise<RefreshTokenResponse> {
      this.loading = true;
      try {
        const response = await api.refreshToken();
        this.isAuth = response.success;
        return response;
      } finally {
        this.loading = false;
      }
    },
    async login(email: string, password: string): Promise<LoginResponse> {
      this.loading = true;
      try {
        const response = await api.login({ email, password });
        this.isAuth = true;
        return response;
      } catch (error) {
        this.errors = (error as { error: Record<string, ErrorData[]> }).error;
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async logout(router: Router) {
      const profileStore = useProfileStore();
      try {
        await api.logout();
      } catch (e) {
        console.error('Logout error', e);
      } finally {
        this.isAuth = false;
        profileStore.clearUser();
        router.push({ name: RouteName.LOGIN });
      }
    },
    clearError() {
      this.errors = undefined;
    },
  }
});
