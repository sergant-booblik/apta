import type { Currency } from '@/types/currency';

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}

export interface Profile {
  id: number,
  email: string,
  name: string | undefined,
  locale: string,
  theme: Theme;
  currencies: Currency[] | undefined,
  defaultCurrency: Currency,
}
