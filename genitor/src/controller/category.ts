import {genitorDataSource} from "../../ormconfig";
import {Category, CategoryType} from "../entity/category";
import {Request, Response} from "express";

const categoryRepository = genitorDataSource.getRepository(Category);

export const getCategories = async (req: Request, res: Response) => {
  const userId = req.params.userId as unknown as number;
  const query = req.query.type as CategoryType;
  const categories = await categoryRepository.find({ where: { user: { id: userId }, type: query } });

  res.send(categories);
}

export const addCategory = async (req: Request, res: Response) => {
  const userId = req.params.userId as unknown as number;
  const { name, type } = req.body;

  const category = await categoryRepository.save({ user: { id: userId }, name, type });

  res.send(category);
}

export const updateCategory = async (req: Request, res: Response) => {
  const id = req.params.id as unknown as number;
  const data = req.body;

  await categoryRepository.update(id, { ...data });
  const category = await categoryRepository.findOne({ where: { id }});

  res.send(category);
}

export const deleteCategory = async (req: Request, res: Response) => {
  const id = req.params.id as unknown as number;

  await categoryRepository.softDelete({ id });

  res.send({
    message: 'success'
  });
}
