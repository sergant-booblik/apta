import { genitorDataSource} from '../../ormconfig';
import { User} from '../entity/user';
import { Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { getUserId } from '../helper/get-user-id';
import { Currency } from '../entity/currency'

const userRepository = genitorDataSource.getRepository(User);
const currencyRepository = genitorDataSource.getRepository(Currency);

export const getMyProfile = async (req: Request, res: Response) => {
  try {
    const accessToken = req.cookies['accessToken'];
    const payload: any = verify(accessToken, 'access_token');

    if (!payload) {
      return res.status(401).send({
        message: 'Unauthenticated',
        error: 'Error.Invalid.Unauthenticated',
      });
    }

    const user = await userRepository.findOne({
      where: {
        id: payload.id,
      },
    });

    res.send({ profile: user });
  } catch (e) {
    return res.status(401).send({
      message: 'Unauthenticated. Some errors',
      error: 'Error.Invalid.Unauthenticated',
    })
  }

}

export const updateProfile = async (req: Request, res: Response) => {
  const accessToken = req.cookies['accessToken'];
  const userId = await getUserId(accessToken).then((result) => result);

  const data = req.body;

  const user = await userRepository
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.currencies', 'currency')
    .where('user.id = :id', { id: userId })
    .getOne();

  if (!user) {
    return res.status(404).send({ message: 'User not found' });
  }

  if (data.currencies) {
    const newCurrencies = await currencyRepository.findByIds(data.currencies);
    user.currencies = newCurrencies;
  }

  Object.assign(user, data);

  await userRepository.save(user);

  res.send({ profile: user });
}
