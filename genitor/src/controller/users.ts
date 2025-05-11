import { genitorDataSource } from '@/ormconfig';
import { User } from '@/entity/user';
import type { Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { getUserId } from '@/helper/get-user-id';
import { Currency } from '@/entity/currency';

const userRepository = genitorDataSource.getRepository(User);
const currencyRepository = genitorDataSource.getRepository(Currency);

export const getMyProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const accessToken = req.cookies['accessToken'];
    const payload: any = verify(accessToken, 'access_token');

    if (!payload) {
      res.status(401).send({
        message: 'Unauthenticated',
        error: 'Error.Invalid.Unauthenticated',
      });
      return;
    }

    const user = await userRepository.findOne({
      where: {
        id: payload.id,
      },
    });

    res.send({ profile: user });
  } catch (error) {
    res.status(401).send({
      message: `Unauthenticated. Some errors: ${error}`,
      error: 'Error.Invalid.Unauthenticated',
    });
    return;
  }

};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  const accessToken = req.cookies['accessToken'];
  const userId = await getUserId(accessToken).then((result) => result);

  const data = req.body;

  const user = await userRepository
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.currencies', 'currency')
    .where('user.id = :id', { id: userId })
    .getOne();

  if (!user) {
    res.status(404).send({ message: 'User not found' });
    return;
  }

  if (data.currencies) {
    user.currencies = await currencyRepository.findBy({ id: data.currencies });
  }

  Object.assign(user, data);

  await userRepository.save(user);

  res.send({ profile: user });
};
