import type {Currency} from "@/types/currency";

export interface Bill {
  id: string,
  amount: number,
  name: string,
  subtitle: string,
  icon: string,
  currency: Currency,
  sumInCurrencies: Record<string, number>,
  initialSum: number,
  incomeSum: number,
  outcomeSum: number,
  transSum: number,
  customIcon: string,
  customColor: string,
}
