import { DataSource } from 'typeorm'
import { Rate } from '../entity/rate'
import { Currency } from '../entity/currency'

export async function fixRateCurrency(dataSource: DataSource) {
  const rateRepository = dataSource.getRepository(Rate);
  const currencyRepository = dataSource.getRepository(Currency);

  const currencies = await currencyRepository.find();

  const rates = await rateRepository.find({ relations: ['currency'] });
  const ratesToUpdate: Partial<Rate>[] = [];

  currencies.forEach((currency) => {
    const isRateExist = rates.find((rate) => rate.currency.id === currency.id);
    if (!isRateExist) {
      ratesToUpdate.push({ updatedDate: new Date(0), currency })
    }
  });

  console.log(ratesToUpdate.length);

  await rateRepository.save(ratesToUpdate);

  // for (const rate of rates) {
  //   const code = rate.currency?.code;
  //
  //   if (!rate.currency.id && code && currencyMap.has(code)) {
  //     rate.currency.id = currencyMap.get(code)!;
  //     ratesToUpdate.push(rate);
  //   }
  //
  //   if (ratesToUpdate.length) {
  //     await rateRepository.save(ratesToUpdate);
  //     console.log(`Updated ${ratesToUpdate.length} rate(s).`);
  //   } else {
  //     console.log('No rates needed updating.');
  //   }
  // }
}