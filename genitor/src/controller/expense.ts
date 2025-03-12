import { genitorDataSource } from '../../ormconfig';
import { Expense } from '../entity/expense';
import { Request, Response } from 'express';
import { Bill } from '../entity/bill';
import { getUserId } from '../helper/get-user-id'
import { ErrorData } from '../type/error'

const expenseRepository = genitorDataSource.getRepository(Expense);
const billRepository = genitorDataSource.getRepository(Bill);

export const getExpenses = async (req: Request, res: Response) => {
  const userId = req.params.userId as unknown as number;
  const expenses = await expenseRepository.find({ where: { user: { id: userId } } });

  res.send(expenses);
}

export const addExpense = async (req: Request, res: Response) => {
  const userId = await getUserId(req.cookies['accessToken']);
  const { name, amount, createdDate, billId, quantity, unitId, categoryId, subcategoryId } = req.body;

  const errors: ErrorData = {};

  if (!name) {
    errors.name = [{ label: 'Error.Expense.Add.Name.empty' }];
  }

  if (!billId) {
    errors.bill = [{ label: 'Error.Expense.Add.Bill.empty' }];
  }

  if (!createdDate) {
    errors.date = [{ label: 'Error.Expense.Add.Date.empty' }];
  }

  if (!quantity || !unitId) {
    errors.quantity = [{ label: 'Error.Expense.Add.Quantity.empty' }];
  }

  if (!amount) {
    errors.amount = [{ label: 'Error.Expense.Add.Amount.empty' }];
  }

  if (Object.keys(errors).length > 0) {
    res.status(400).send({ errors })
  } else {
    const expense = await expenseRepository.save({
      user: { id: userId },
      bill: { id: billId as string },
      category: { id: categoryId as number },
      subcategory: { id: subcategoryId as number },
      unit: { id: unitId as number },
      quantity,
      amount,
      createdDate,
      name,
    });

    res.status(200).send({ expense });
  }


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
