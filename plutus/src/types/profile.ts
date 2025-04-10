import type { Currency } from '@/types/currency'

export interface Profile {
  id: number,
  email: string,
  name: string | undefined,
  locale: string,
  currencies: Currency[] | undefined,
  defaultCurrency: Currency,
}
