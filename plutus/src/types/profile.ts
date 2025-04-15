import type { Currency } from '@/types/currency'

export interface Profile {
  id: number,
  email: string,
  name: string | undefined,
  locale: string,
  theme: 'light' | 'dark';
  currencies: Currency[] | undefined,
  defaultCurrency: Currency,
}
