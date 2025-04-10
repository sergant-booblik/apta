import { Currency } from '../entity/currency';
import { genitorDataSource } from '../../ormconfig'

const DEFAULT_CURRENCY_CODE = 'USD';

const currencyRepository = genitorDataSource.getRepository(Currency);

export async function calculateDefaultCurrency(userLocale: string): Promise<Currency | null> {
  const defaultCurrency = await currencyRepository.findOne({
    where: { code: DEFAULT_CURRENCY_CODE }
  });

  const currencyByLocale = await currencyRepository
    .createQueryBuilder()
    .where('FIND_IN_SET(:locale, currency.locale)', { locale: userLocale })
    .getOne();

  console.log(currencyByLocale, defaultCurrency);

  return currencyByLocale ?? defaultCurrency;
}