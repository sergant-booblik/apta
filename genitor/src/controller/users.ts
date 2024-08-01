import { genitorDataSource} from '../../ormconfig';
import { User} from '../entity/user';
import { Request, Response } from 'express';

const userRepository = genitorDataSource.getRepository(User);

export const getUser = async (req: Request, res: Response) => {
  const id = req.params.id as unknown as number;
  const user = await userRepository.findOne({
    where: { id: id as number },
    select: ['id', 'name', 'email', 'createdDate', 'deletedDate', 'isBlocked', 'isConfirmed', 'imageUrl', 'currencies', 'locale', 'defaultCurrency'],
  });

  res.send({
    ...user,
  });
}

export const updateUser = async (req: Request, res: Response) => {
  const id = req.params.id as unknown as number;
  const data = req.body;

  const user = await userRepository.findOne({
    select: ['id', 'name', 'email', 'createdDate', 'deletedDate', 'isBlocked', 'isConfirmed', 'imageUrl', 'currencies', 'locale', 'defaultCurrency'],
    relations: {
      currencies: true,
    },
    where: { id: id },
  });

  await userRepository.save({
    ...user,
    ...data,
  });

  res.send({
    ...user,
    ...data,
  })
}
