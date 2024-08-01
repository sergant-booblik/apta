import { genitorDataSource } from '../../ormconfig';
import { Expense } from '../entity/expense';
import { Request, Response } from 'express';
import { Bill } from '../entity/bill';

const expenseRepository = genitorDataSource.getRepository(Expense);
const billRepository = genitorDataSource.getRepository(Bill);

export const getExpenses = async (req: Request, res: Response) => {
  const userId = req.params.userId as unknown as number;
  const expenses = await expenseRepository.find({ where: { user: { id: userId } } });

  res.send(expenses);
}

export const addExpense = async (req: Request, res: Response) => {
  const userId = req.params.userId as unknown as number;
  const { name, amount, billId, categoryId, subcategoryId } = req.body;

  await genitorDataSource.transaction(async () => {
    await billRepository.decrement({ id: billId }, 'amount', amount);

    const expense = await expenseRepository.save({
      user: { id: userId },
      bill: { id: billId as string },
      category: { id: categoryId as number },
      subcategory: { id: subcategoryId as number },
      amount,
      name,
    });

    res.send(expense);
  });
}

export const updateExpense = async (req: Request, res: Response) => {
  const id = req.params.id as unknown as number;
  const userId = req.params.userId as unknown as number;
  const updatingExpense = await expenseRepository.findOne({ where: { id } });

  const {
    billId,
    categoryId,
    subcategoryId,
    amount,
    name
  } = await req.body;

  await genitorDataSource.transaction(async () => {
    if (updatingExpense) {
      await billRepository.increment({ id: updatingExpense.bill.id }, 'amount', updatingExpense.amount);
      await billRepository.decrement({ id: billId }, 'amount', amount);

      await expenseRepository.update(id, {
        user: { id: userId },
        bill: { id: billId as string },
        category: { id: categoryId as number },
        subcategory: { id: subcategoryId as number },
        amount,
        name,
      });

      const expense = await expenseRepository.findOne({ where: { id } });

      res.send(expense);
    }
  });
}

export const deleteExpense = async (req: Request, res: Response) => {
  const id = req.params.id as unknown as number;
  const removingExpense = await expenseRepository.findOne({ where: { id } });

  await genitorDataSource.transaction(async () => {
    if (removingExpense) {
      await billRepository.decrement({ id: removingExpense.bill.id }, 'amount', removingExpense.amount);
      await expenseRepository.softDelete({ id });

      res.send({ message: 'success' });
    }
  });
}
