import { genitorDataSource } from '../../ormconfig';
import { Income } from '../entity/income';
import { Request, Response } from 'express';
import { Bill } from '../entity/bill';

const incomeRepository = genitorDataSource.getRepository(Income);
const billRepository = genitorDataSource.getRepository(Bill);

export const getIncomes = async (req: Request, res: Response) => {
  const userId = req.params.userId as unknown as number;
  const incomes = await incomeRepository.find({ where: { user: { id: userId } } });

  res.send(incomes);
}

export const addIncome = async (req: Request, res: Response) => {
  const userId = req.params.userId as unknown as number;
  const { name, amount, billId, categoryId, subcategoryId } = req.body;

  await genitorDataSource.transaction(async () => {
    await billRepository.increment({ id: billId }, 'amount', amount);

    const income = await incomeRepository.save({
      user: { id: userId },
      bill: { id: billId as string },
      category: { id: categoryId as number },
      subcategory: { id: subcategoryId as number },
      amount,
      name,
    });

    res.send(income);
  });
}

export const updateIncome = async (req: Request, res: Response) => {
  const id = req.params.id as unknown as number;
  const userId = req.params.userId as unknown as number;
  const updatingIncome = await incomeRepository.findOne({ where: { id } });

  const {
    billId,
    categoryId,
    subcategoryId,
    amount,
    name
  } = await req.body;

  await genitorDataSource.transaction(async () => {
    if (updatingIncome) {
      await billRepository.decrement({ id: updatingIncome.bill.id }, 'amount', updatingIncome.amount);
      await billRepository.increment({ id: billId }, 'amount', amount);

      await incomeRepository.update(id, {
        user: { id: userId },
        bill: { id: billId as string },
        category: { id: categoryId as number },
        subcategory: { id: subcategoryId as number },
        amount,
        name,
      });

      const expense = await incomeRepository.findOne({ where: { id } });

      res.send(expense);
    }
  });
}

export const deleteIncome = async (req: Request, res: Response) => {
  const id = req.params.id as unknown as number;
  const removingIncome = await incomeRepository.findOne({ where: { id } });

  await genitorDataSource.transaction(async () => {
    if (removingIncome) {
      await billRepository.increment({ id: removingIncome.bill.id }, 'amount', removingIncome.amount);
      await incomeRepository.softDelete({ id });

      res.send({ message: 'success' });
    }
  });
}
