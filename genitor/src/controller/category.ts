import {genitorDataSource} from "../../ormconfig";
import {Category, CategoryType} from "../entity/category";
import {Request, Response} from "express";
import { getUserId } from '../helper/get-user-id'
import { Subcategory } from '../entity/subcategory'
import { Unit } from '../entity/unit'

const categoryRepository = genitorDataSource.getRepository(Category);
const subcategoryRepository = genitorDataSource.getRepository(Subcategory);
const unitsRepository = genitorDataSource.getRepository(Unit);

export async function fetchCategories(req: Request, res: Response) {
  try {
    const userId = await getUserId(req.cookies['accessToken']);
    const type = req.query.type as CategoryType;
    const categories = await categoryRepository.find({
      where: { user: { id: userId }, type },
    });
    res.send({ categories })
  }
  catch (error) {

  }
}

export async function fetchSubcategories(req: Request, res: Response) {
  try {
    const categoryId = req.query.category as unknown as number;
    const subcategories = await subcategoryRepository.find({
      where: { category: { id: categoryId } },
    });
    res.send({ subcategories })
  }
  catch (error) {

  }
}

export async function fetchUnits(req: Request, res: Response) {
  try {
    const userId = await getUserId(req.cookies['accessToken']);
    const units = await unitsRepository.find({
      where: { user: { id: userId } },
    });
    res.send({ units })
  }
  catch (error) {

  }
}

export const addCategory = async (req: Request, res: Response) => {
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

  }
}

export const addSubcategory = async (req: Request, res: Response) => {
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

  }
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
