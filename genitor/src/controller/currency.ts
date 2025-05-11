import { genitorDataSource } from '@/ormconfig';
import { Currency } from '@/entity/currency';
import type { Request, Response } from 'express';

const currencyRepository = genitorDataSource.getRepository(Currency);

export const getPinnedCurrencies = async (req: Request, res: Response): Promise<void> => {
  const currencies = await currencyRepository.find({
    order: { num: 'ASC' },
  });

  res.send({ currencies });
};
