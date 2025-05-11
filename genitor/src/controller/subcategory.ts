import { genitorDataSource } from '@/ormconfig';
import type { Request, Response } from 'express';
import { Subcategory } from '@/entity/subcategory';
import { getUserId } from '@/helper/get-user-id';

const subcategoryRepository = genitorDataSource.getRepository(Subcategory);

export async function fetchSubcategories(req: Request, res: Response): Promise<void> {
  try {
    const categoryId = req.query.category as unknown as number;
    const subcategories = await subcategoryRepository.find({
      where: { category: { id: categoryId } },
    });
    res.send({ subcategories });
  }
  catch (error) {
    res.status(400).send({
      message: error,
    });
  }
}

export const addSubcategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = await getUserId(req.cookies['accessToken']);
    const { name, emoji, categoryId } = req.body;
    const subcategory = await subcategoryRepository.save({
      user: { id: userId },
      category: { id: categoryId },
      name,
      emoji,
    });

    res.send({ subcategory });
  } catch (error) {
    res.status(400).send({
      message: error,
    });
  }
};
