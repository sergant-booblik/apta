import { defineStore } from 'pinia';
import { api } from '@/api';
import type { Expense } from '@/types/expense'
import type { ErrorData } from '@/types/error'
import type { AddExpenseResponse } from '@/api/add-expense'

interface ExpenseState {
  expenses: Expense[],
  currentExpense: Expense | undefined,
  errors: ErrorData,
}

export const useExpenseStore = defineStore('expense', {
  state: (): ExpenseState => ({
    expenses: [],
    currentExpense: undefined,
    errors: {},
  }),
  actions: {
    async addExpense(expense: Expense): Promise<AddExpenseResponse> {
      return new Promise((resolve, reject) => {
        api.addExpense({ expense })
          .then((response) => {
            if (response.expense) {
              this.expenses.push(response.expense);
              this.currentExpense = response.expense;
            }
            if (response.errors) {
              this.errors = response.errors;
            }

            resolve(response);
          }).catch((error) => {
          reject(error);
        });
      });
    },
    clearExpenses() {
      this.expenses = [];
      this.currentExpense = undefined;
      this.errors = {};
    },
  },
})