import { api } from '@/api';
import { defineStore } from 'pinia';
import type { Transaction } from '@/types/bill';
import type { FetchBillTransactionsResponse } from '@/api/fetch-bill-transactions';

interface TransactionState {
  transactions: Transaction[],
}

export const useTransactionStore = defineStore('transaction', {
  state: (): TransactionState => ({
    transactions: [],
  }),
  actions: {
    fetchTransaction(id: string, count?: number) {
      return new Promise<FetchBillTransactionsResponse>((resolve, reject) => {
        api.fetchBillTransaction({ id, count })
          .then((response) => {
            this.transactions = response.transactions;
            resolve(response);
          }).catch((error) => reject(error));
      });
    },
    clearTransactions() {
      this.transactions = [];
    },
  }
});