import { Request, Response } from 'express';
import { genitorDataSource } from '../../ormconfig';
import { Currency } from '../entity/currency';
import { Not } from 'typeorm';

const currencyRepository = genitorDataSource.getRepository(Currency);

export const getPinnedCurrencies = async (req: Request, res: Response) => {
  const isPinned = req.query.pinned;
  const currencies = await currencyRepository.find({
    where: { pinned: isPinned !== undefined }
  });

  res.send({ currencies });
}
