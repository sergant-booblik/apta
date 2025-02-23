import type { Bill } from '@/types/bill'
import { defineStore } from 'pinia';
import { api } from '@/api';
import type { UpdateBillResponse } from '@/api/update-bill'
import type { Currency } from '@/types/currency'

interface BillState {
  bills: Bill[],
  total?: {
    amount: number,
    currencyCode: string,
  },
  loadingBills: boolean,
  loadingTotal: boolean,
}

export const useBillStore = defineStore('bill', {
  state: (): BillState => ({
    bills: [],
    total: undefined,
    loadingBills: false,
    loadingTotal: false,
  }),
  getters: {
    hasBills: (state: BillState): boolean => state.bills.length > 0,
    getCertainBill: (state: BillState): (id: string | undefined | number) => Bill | undefined => (id: string | undefined | number): Bill | undefined => state.bills.find((bill) => bill.id === id),
  },
  actions: {
    async fetchBills(isShowClosed?: boolean) {
      return new Promise((resolve, reject) => {
        this.loadingBills = true;
        api.fetchBills({ isShowClosed })
          .then((response) => {
            this.bills = response.bills;

            resolve(response);
          })
          .catch((error) => reject(error))
          .finally(() => {
            this.loadingBills = false;
          });
      });
    },
    async fetchTotalSum(currency?: string, isShowClosed?: boolean) {
      return new Promise((resolve, reject) => {
        this.loadingTotal = true;
        api.fetchTotalSum({ currency, isShowClosed })
          .then((response) => {
            this.total = response.total;

            resolve(response);
          })
          .catch((error) => reject(error))
          .finally(() => {
            this.loadingTotal = false;
          });
      });
    },
    async addBill(id: number, bill: Bill) {
      return new Promise((resolve, reject) => {
        this.loadingBills = true;
        api.addBill({ id, bill })
          .then((response) => {
            this.fetchBills();

            resolve(response);
          })
          .catch((error) => reject(error))
          .finally(() => {
            this.loadingBills = false;
          });
      });
    },
    async uploadBillIcon(bill: Bill | undefined, files: FileList | null | undefined) {
      return new Promise((resolve, reject) => {
        api.uploadBillIcon({ id: bill?.id, files })
          .then((response) => {
            if (bill) {
              bill.customIcon = response.bill.customIcon;
            }

            resolve(response);
          })
          .catch((error) => reject(error));
      });
    },
    async updateBill(bill: Partial<Bill>) {
      return new Promise<UpdateBillResponse>((resolve, reject) => {
        api.updateBill({ bill })
          .then((response) => {
            const billIndex = this.bills.indexOf(response.bill);
            this.bills[billIndex] = response.bill;
          })
      })
    },
    async deleteBill(bill: Bill) {
      return new Promise((resolve, reject) => {
        api.deleteBill({ id: bill.id })
          .then((response) => {
            resolve(response);
          }).catch((error) => reject(error))
      })
    },
  }
});
