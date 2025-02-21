import { NextFunction, Request, Response } from 'express'
import { genitorDataSource } from '../../ormconfig';
import { Bill } from '../entity/bill';
import {User} from "../entity/user";
import {Transfer} from "../entity/transfer";
import {getCurrencies} from "./rate";
import { PORT } from '../index'
import { getUserId } from '../helper/get-user-id'
import { Income } from '../entity/income'
import { Expense } from '../entity/expense'
import { Currency } from '../entity/currency'
import ShortUniqueId from 'short-unique-id'

export interface TransferInterface {
  type: 'income' | 'expense' | 'transferReceived' | 'transferSend',
  amount: number,
  category: string,
  subcategory: string,
  name: string,
  date: Date,
}

const billRepository = genitorDataSource.getRepository(Bill);
const userRepository = genitorDataSource.getRepository(User);
const transferRepository = genitorDataSource.getRepository(Transfer);
const incomeRepository = genitorDataSource.getRepository(Income);
const expenseRepository = genitorDataSource.getRepository(Expense);
const currencyRepository = genitorDataSource.getRepository(Currency);

export const fetchBills = async (req: Request, res: Response) => {
  const accessToken = req.cookies['accessToken'];
  const userId = await getUserId(accessToken).then((result) => result);

  const bills = await billRepository.find({
    where: { user: { id: userId } },
  });

  const userData = await userRepository.findOne({ where: { id: userId } });
  const userCurrencies = userData?.currencies.map((currency) => currency.code);
  if (!userCurrencies) {
    return;
  }
  const rates = await getCurrencies(userCurrencies)
    .then((result) => result.reduce((obj, rate) => Object.assign(
      obj, { [rate.currency.code]: rate.rate }
    ), {} as Record<string, number> ));

  const transfers = await transferRepository.find({
    where: { user: { id: userId } },
  });

  const incomes = await incomeRepository.find({
    where: {
      user: { id: userId },
    },
  });

  const expenses = await expenseRepository.find({
    where: { user: { id: userId } },
  });

  const modifiedBills = bills.map((bill) => {
    const sumInCurrencies = userCurrencies?.reduce((obj, currency) => Object.assign(
      obj, { [currency]: bill.amount / (rates[bill.currency.code] / rates[currency] ) }
    ), {} as Record<string, number>);
    let incomeSum = 0;
    let outcomeSum = 0;
    transfers.forEach((transfer) => {
      if (transfer.receivingBill.id === bill.id) {
        incomeSum = incomeSum + transfer.amountReceived;
      }
      if (transfer.sendingBill.id === bill.id) {
        outcomeSum = outcomeSum - transfer.amountSent;
      }
    });
    incomes.forEach((income) => {
      if (income.bill.id === bill.id) {
        incomeSum = incomeSum + income.amount;
      }
    });
    expenses.forEach((expense) => {
      if (expense.bill.id === bill.id) {
        outcomeSum = outcomeSum - expense.amount;
      }
    });
    const modifiedTransfers = transfers.map((transfer) => {
      if (transfer.receivingBill.id === bill.id || transfer.sendingBill.id === bill.id) {
        return ({
          type: transfer.receivingBill.id === bill.id ? 'transferReceived' : 'transferSend',
          amount: transfer.receivingBill.id === bill.id ? transfer.amountReceived : transfer.amountSent * -1,
          category: 'Transfer.History.transaction',
          subcategory: transfer.receivingBill.id === bill.id ? 'Transfer.History.received' : 'Transfer.History.sent',
          name: transfer.receivingBill.id === bill.id ? 'Transfer.History.from' : 'Transfer.History.to',
          date: transfer.createdDate,
        });
      }
    });
    const modifiedIncomes = incomes.map((income) => {
      if (income.bill.id === bill.id) {
        return {
          type: 'income',
          amount: income.amount,
          category: `${income.category.emoji} ${income.category.name}`,
          subcategory: `${income.subcategory.emoji} ${income.subcategory.name}`,
          name: income.name,
          date: income.createdDate,
        }
      }
    });
    const modifiedExpenses = expenses.map((expense) => {
      if (expense.bill.id === bill.id) {
        return {
          type: 'expense',
          amount: expense.amount * -1,
          category: `${expense.category.emoji} ${expense.category.name}`,
          subcategory: `${expense.subcategory.emoji} ${expense.subcategory.name}`,
          name: expense.name,
          date: expense.createdDate,
        }
      }
    });

    const transferHistory = [
      ...modifiedTransfers.filter((item) => item !== undefined),
      ...modifiedIncomes.filter((item) => item !== undefined),
      ...modifiedExpenses.filter((item) => item !== undefined),
    ];
    transferHistory
      .filter((transfer) => transfer !== undefined)
      .slice(0, 10)
      .sort((a, b) => Number(a?.date) - Number(b?.date));
    const transSum = incomeSum + outcomeSum;
    const currentAmount = bill.amount + transSum;
    return {
      ...bill,
      transfers: transferHistory,
      incomeSum,
      outcomeSum: Math.abs(outcomeSum),
      transSum,
      currentAmount,
      sumInCurrencies,
    }
  });

  function getSumByCurrency (currency: string) {
    let sum = 0;
    modifiedBills.forEach((bill) => {
      if (bill.sumInCurrencies) {
        sum = sum + bill.sumInCurrencies[currency];
      }
    });
    return sum;
  }

  const totals = userCurrencies?.reduce((obj, currency) => Object.assign(
    obj, { [currency]: getSumByCurrency(currency) }
  ), {});

  res.send({ bills: modifiedBills, rates, totals });
}

export const addBill = async (req: Request, res: Response) => {
  const accessToken = req.cookies['accessToken'];
  const userId = await getUserId(accessToken).then((result) => result);
  const { randomUUID } = new ShortUniqueId({ length: 5 });

  const { amount, currencyId, name } = req.body;

  const bill = await billRepository.save({ ...req.body, id: randomUUID(), user: { id: userId }, name, amount, currency: { id: currencyId } });

  res.send(bill);
}

export const uploadBillIcon = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id as unknown;
  const customIconUrl = `${req.protocol}://${req.hostname}:${PORT}/icon/${req.file?.filename}`;
  await billRepository.update({ id: id as string } , {customIcon: customIconUrl }).then((result) => {
    console.log(result);
  });
  const bill = await billRepository.findOne({ where: { id: id as string } });

  res.send({ bill });
}

export const UpdateBill = async (req: Request, res: Response) => {
  const id = req.params.id as unknown;
  const { data } = req.body;

  await billRepository.update(id as string, { ...data });
  const bill = await billRepository.findOne({ where: { id: id as string | undefined } });

  res.send(bill);
}

export const deleteBill = async (req: Request, res: Response) => {
  const id = req.params.id as unknown;

  const bill = await billRepository.findOne({
    where: { id: id as string },
    relations: ['sendingTransfers', 'receivingTransfers', 'expenses', 'incomes'],
  });

  if (bill?.sendingTransfers.length) {
    await transferRepository.softRemove(bill?.sendingTransfers);
  }

  if (bill?.receivingTransfers.length) {
    await transferRepository.softRemove(bill?.receivingTransfers);
  }

  if (bill?.expenses.length) {
    await expenseRepository.softRemove(bill?.expenses);
  }

  if (bill?.incomes.length) {
    await incomeRepository.softRemove(bill?.incomes);
  }

  await billRepository.softDelete({ id: id as string });

  res.send({
    message: 'success'
  });
}
