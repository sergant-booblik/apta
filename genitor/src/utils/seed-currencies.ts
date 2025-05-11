// eslint-disable-next-line no-restricted-imports
import * as rawCurrencySeed from '../../resources/currency-seed.json';
import type { DataSource } from 'typeorm';
import { Currency } from '@/entity/currency';

export async function seedCurrenciesIfNeeded(dataSource: DataSource): Promise<void> {
  const currencyRepository = dataSource.getRepository(Currency);

  const existing = await currencyRepository.find();
  const existingCodes = new Set(existing.map(c => c.code));

  const currencySeed = (rawCurrencySeed as any).default as Currency[];
  const missing = currencySeed.filter((c: Currency | undefined) => c?.code && !existingCodes?.has(c.code));

  if (missing && missing.length > 0) {
    const missingCurrenciesFiltered = missing.filter((currency): currency is Currency => currency !== undefined);
    await currencyRepository.save(missingCurrenciesFiltered);
  }
}