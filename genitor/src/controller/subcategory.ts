import { genitorDataSource } from '../../ormconfig';
import { Subcategory } from '../entity/subcategory';
import { Request, Response } from 'express';

const subcategoryRepository = genitorDataSource.getRepository(Subcategory);

export const getSubCategories = async (req: Request, res: Response) => {
  const { categoryId } = req.body;
  const subcategories = await subcategoryRepository.find({ where: { category: { id: categoryId }} });

  res.send(subcategories);
}

export const addSubcategory = async (req: Request, res: Response) => {
  const { name, categoryId } = req.body;

  const subcategory = await subcategoryRepository.save({ category: { id: categoryId }, name });

  res.send(subcategory);
}

export const updateSubcategory = async (req: Request, res: Response) => {
  const id = req.params.id as unknown as number;
  const data = req.body;

  await subcategoryRepository.update(id, { ...data });
  const category = await subcategoryRepository.findOne({ where: { id }});

  res.send(category);
}

export const deleteSubcategory = async (req: Request, res: Response) => {
  const id = req.params.id as unknown as number;

  await subcategoryRepository.softDelete({ id });

  res.send({
    message: 'success'
  });
}
