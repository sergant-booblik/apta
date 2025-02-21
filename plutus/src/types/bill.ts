import type {Currency} from "@/types/currency";

export interface Bill {
  id: string,
  amount: number,
  name: string,
  subtitle: string,
  icon: string,
  currency: Currency,
  transfers: Transfer[],
  sumInCurrencies: Record<string, number>,
  currentAmount: number,
  incomeSum: number,
  outcomeSum: number,
  transSum: number,
  customIcon: string,
  customColor: string,
  customFontColor: string,
  isClosed: boolean,
}

export interface Transfer {
  type: 'income' | 'expense' | 'transferReceived' | 'transferSend',
  amount: number,
  category: string,
  subcategory: string,
  name: string,
  date: Date,
}
