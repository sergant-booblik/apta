import {genitorDataSource} from "../../ormconfig";
import {Rate} from "../entity/rate";
import {Currency} from "../entity/currency";

const rateRepository = genitorDataSource.getRepository(Rate);
const currencyRepository = genitorDataSource.getRepository(Currency);

const currencyExchangeAPI = {
  endpoint: 'https://openexchangerates.org/api/latest.json',
  acces_key: '0769b602fe044773aaaa481d3bdbb9ac',
}

export const getCurrencies = async (reqCurrencies: string[]) => {
  const whereOptions = reqCurrencies
    .map((currencyCode) => ({
      currency: { code: currencyCode }
    }));
  const rates = await rateRepository.find({
    where: whereOptions,
  });
  const updatedDates = rates.map((rate) => rate.updatedDate.getTime());
  const lastUpdatedDate = Math.max(...updatedDates);
  const isOutdatedRates = rates.some((rate) => {
    const currentDate = Date.now();
    const updatedDate = new Date(rate.updatedDate).getTime();
    return (currentDate - updatedDate) / (1000 * 60 * 60 * 12) > 1;
  });
  if (isOutdatedRates) {
    await updateAllCurrencies()
  }

  return await rateRepository.find({
    where: whereOptions,
  });
}

const updateAllCurrencies = async () => {
  const allRates = await rateRepository.find({});
  const allCurrencies = await currencyRepository.find({});
  const allCurrenciesList = allCurrencies.map((currency) => currency.code);

  const url = new URL(currencyExchangeAPI.endpoint);
  url.searchParams.append('app_id', currencyExchangeAPI.acces_key);
  url.searchParams.append('symbols', allCurrenciesList.toString());

  const rates = await fetch(url.toString())
    .then((resp) => resp.json())
    .then((resp) => resp.rates);

  const result = allRates.map((rate) => {
    const id = rate.id;
    const newRate = rates[rate.currency.code];
    return {
      id,
      rate: newRate,
    }
  });

  const savedResult = await rateRepository.save(result);
  return(savedResult);
}
