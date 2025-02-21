import type { Currency } from '@/types/currency'

export interface Profile {
  id: number | undefined,
  email: string | undefined,
  name: string | undefined,
  locale: string | undefined,
  currencies: Currency[] | undefined,
  defaultCurrency: Currency | undefined,
}
