import type { Currency } from '@/types/currency';
import type { CategoryType } from '@/types/category';

export interface Bill {
  id: string,
  amount: number,
  name: string,
  subtitle: string,
  icon: string,
  currency: Currency,
  currentAmount: number,
  incomeSum: number,
  outcomeSum: number,
  transSum: number,
  customIcon: string,
  customColor: string,
  customFontColor: string,
  isClosed: boolean,
}

export interface Transaction {
  type: CategoryType | 'transferReceived' | 'transferSend',
  amount: number,
  category: string,
  subcategory: string,
  name: string,
  date: Date,
}
