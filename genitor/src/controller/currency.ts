import { Request, Response } from 'express';
import { genitorDataSource } from '../../ormconfig';
import { Currency } from '../entity/currency';

const currencyRepository = genitorDataSource.getRepository(Currency);

export const getPinnedCurrencies = async (req: Request, res: Response) => {
  const currencies = await currencyRepository.find({
    order: { num: 'ASC' },
  });

  res.send({ currencies });
}
