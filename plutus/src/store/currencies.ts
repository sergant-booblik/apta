import { defineStore } from 'pinia';
import type { Currency } from '@/types/currency';
import { api } from '@/api';

interface CurrenciesState {
  pinnedCurrencies: Currency[],
  unpinnedCurrencies: Currency[],
}

export const useCurrenciesStore = defineStore('currencies-store', {
  state: (): CurrenciesState => ({
    pinnedCurrencies: [],
    unpinnedCurrencies: [],
  }),
  actions: {
    async fetchCurrencies() {
      return new Promise((resolve, reject) => {
        api.fetchCurrencies()
          .then((response) => {
            this.pinnedCurrencies = response.currencies.filter((currency) => currency.pinned);
            this.unpinnedCurrencies = response.currencies.filter((currency) => !currency.pinned);

            resolve(response);
          }).catch((error) => reject(error));
      });
    },
    clearCurrencies() {
      this.pinnedCurrencies = [];
      this.unpinnedCurrencies = [];
    },
  },
});
