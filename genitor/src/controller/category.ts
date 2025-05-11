import { genitorDataSource } from '@/ormconfig';
import type { CategoryType } from '@/entity/category';
import { Category } from '@/entity/category';
import type { Request, Response } from 'express';
import { getUserId } from '@/helper/get-user-id';
import { Unit } from '@/entity/unit';

const categoryRepository = genitorDataSource.getRepository(Category);
const unitsRepository = genitorDataSource.getRepository(Unit);

export async function fetchCategories(req: Request, res: Response): Promise<void> {
  try {
    const userId = await getUserId(req.cookies['accessToken']);
    const type = req.query.type as CategoryType;
    const categories = await categoryRepository.find({
      where: { user: { id: userId }, type },
    });
    res.send({ categories });
  }
  catch (error) {
    res.status(400).send({
      message: `Some errors: ${error}`,
    });
  }
}

export async function fetchUnits(req: Request, res: Response): Promise<void> {
  try {
    const userId = await getUserId(req.cookies['accessToken']);
    const units = await unitsRepository.find({
      where: { user: { id: userId } },
    });
    res.send({ units });
  }
  catch (error) {
    res.status(400).send({
      message: `Some errors: ${error}`,
    });
  }
}

export const addCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = await getUserId(req.cookies['accessToken']);
    const { name, emoji, type } = req.body;
    const category = await categoryRepository.save({
      user: { id: userId },
      name,
      emoji,
      type,
    });

    res.send({ category });
  } catch (error) {
    res.status(400).send({
      message: `Some errors: ${error}`,
    });
  }
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id as unknown as number;
  const data = req.body;

  await categoryRepository.update(id, { ...data });
  const category = await categoryRepository.findOne({ where: { id } });

  res.send(category);
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id as unknown as number;

  await categoryRepository.softDelete({ id });

  res.send({
    message: 'success',
  });
};
