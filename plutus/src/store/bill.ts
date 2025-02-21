import type { Bill, Transfer } from '@/types/bill'
import { defineStore } from 'pinia';
import { api } from '@/api';
import type {AddBillRequest} from "@/api/add-bill";
import type { UpdateBillResponse } from '@/api/update-bill'

interface BillState {
  bills: Bill[],
  rates: Record<string, number>,
  loading: boolean,
  totals: Record<string, number>,
}

export const useBillStore = defineStore('bill', {
  state: (): BillState => ({
    bills: [],
    rates: {},
    loading: false,
    totals: {},
  }),
  getters: {
    hasBills: (state: BillState): boolean => state.bills.length > 0,
    getCertainBill: (state: BillState): (id: string | undefined | number) => Bill | undefined => (id: string | undefined | number): Bill | undefined => state.bills.find((bill) => bill.id === id),
  },
  actions: {
    fetchBills() {
      return new Promise((resolve, reject) => {
        this.loading = true;
        api.fetchBills()
          .then((response) => {
            this.bills = response.bills;
            this.rates = response.rates;
            this.totals = response.totals;

            resolve(response);
          })
          .catch((error) => reject(error))
          .finally(() => {
            this.loading = false;
          });
      });
    },
    async addBill(id: number, bill: Bill) {
      return new Promise((resolve, reject) => {
        this.loading = true;
        api.addBill({ id, bill })
          .then((response) => {
            this.fetchBills();

            resolve(response);
          })
          .catch((error) => reject(error))
          .finally(() => {
            this.loading = false;
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
