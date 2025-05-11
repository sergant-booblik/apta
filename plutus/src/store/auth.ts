import { defineStore } from 'pinia';
import { useProfileStore } from '@/store/profile';
import { api } from '@/api';
import type { RefreshTokenResponse, VerifyTokenResponse } from '@/api/auth';
import type { ErrorData } from '@/types/error';
import { RouteName } from '@/router';
import type { LoginResponse } from '@/api/login';
import type { Router } from 'vue-router';
import type { RegisterResponse } from '@/api/register';
import { useBillStore } from '@/store/bill';
import { useCurrenciesStore } from '@/store/currencies';
import { useCategoryStore } from '@/store/category';
import { useExpenseStore } from '@/store/expense';
import { useTransactionStore } from '@/store/transaction';


interface AuthState {
  isAuth: boolean,
  errors: ErrorData | undefined;
  loading: boolean,
}

function clearStores(): void {
  const billStore = useBillStore();
  const categoryStore = useCategoryStore();
  const currencyStore = useCurrenciesStore();
  const expenseStore = useExpenseStore();
  const profileStore = useProfileStore();
  const transactionStore = useTransactionStore();

  profileStore.clearUser();
  billStore.clearBills();
  currencyStore.clearCurrencies();
  expenseStore.clearExpenses();
  transactionStore.clearTransactions();
  categoryStore.clearCategories();
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
    async register(email: string, password: string, name: string, locale: string): Promise<RegisterResponse> {
      this.loading = true;
      try {
        const response = await api.register({ email, password, name, locale });
        this.isAuth = true;
        return response;
      } catch (error) {
        this.errors = (error as { error: ErrorData }).error;
        throw error;
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
        this.errors = (error as { error: ErrorData }).error;
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async logout(router: Router) {
      try {
        await api.logout();
      } catch (e) {
        console.error('Logout error', e);
      } finally {
        this.isAuth = false;
        clearStores();
        await router.push({ name: RouteName.LOGIN });
      }
    },
    clearError() {
      this.errors = undefined;
    },
  },
});
