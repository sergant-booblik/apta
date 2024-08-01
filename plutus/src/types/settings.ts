import type { Currency } from '@/types/currency';

export interface Settings {
  locale: string | undefined,
  currencies: Currency[],
  defaultCurrency: Currency | undefined,
}
