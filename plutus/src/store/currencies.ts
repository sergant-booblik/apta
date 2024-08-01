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
    async fetchPinnedCurrencies() {
      return new Promise((resolve, reject) => {
        api.fetchCurrencies({ isPinnedCurrencies: true })
          .then((response) => {
            this.pinnedCurrencies = response.currencies;

            resolve(response);
          }).catch((error) => reject(error));
      });
    },
    async fetchUnpinnedCurrencies() {
      return new Promise((resolve, reject) => {
        api.fetchCurrencies({ isPinnedCurrencies: false })
          .then((response) => {
            this.unpinnedCurrencies = response.currencies;

            resolve(response);
          }).catch((error) => reject(error));
      });
    }
  },
});
