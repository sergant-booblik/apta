import { NextFunction, Request, Response } from 'express'
import { genitorDataSource } from '../../ormconfig';
import { User } from '../entity/user';
import { Bill } from '../entity/bill';
import { Transfer } from '../entity/transfer';
import { getUserId } from '../helper/get-user-id';
import { Income } from '../entity/income';
import { Expense } from '../entity/expense';
import ShortUniqueId from 'short-unique-id';
import uploadToS3 from '../middleware/upload';
import { getCurrencies } from './rate';
import { Currency } from '../entity/currency';
type TransactionType = 'income' | 'expense';
type TransferType = 'transferReceived' | 'transferSend';

const repositories = {
  user: genitorDataSource.getRepository(User),
  bill: genitorDataSource.getRepository(Bill),
  transfer: genitorDataSource.getRepository(Transfer),
  income: genitorDataSource.getRepository(Income),
  expense: genitorDataSource.getRepository(Expense),
};

const formatTransaction = (
  transaction: Income | Expense,
  type: TransactionType,
  amount: number,
) => ({
  type,
  amount,
  category: `${transaction.category.emoji} ${transaction.category.name}`,
  subcategory: `${transaction.subcategory.emoji} ${transaction.subcategory.name}`,
  name: transaction.name,
  date: transaction.createdDate,
});

const processTransactions = (
  transactions: Income[] | Expense[],
  billId: string,
  type: TransactionType,
  amountMultiplier = 1,
) =>
  transactions
    .filter(tx => tx.bill.id === billId)
    .map(tx => formatTransaction(tx, type, tx.amount * amountMultiplier));

const getModifiedBills = async (userId: number) => {
  const [bills, transfers, incomes, expenses] = await Promise.all([
    repositories.bill.find({ where: { user: { id: userId } } }),
    repositories.transfer.find({ where: { user: { id: userId } } }),
    repositories.income.find({ where: { user: { id: userId } } }),
    repositories.expense.find({ where: { user: { id: userId } } }),
  ]);

  const incomeMap = new Map();
  const expenseMap = new Map();
  const transferMap = new Map();

  incomes.forEach(({ bill, amount }) => incomeMap.set(bill.id, (incomeMap.get(bill.id) || 0) + amount));
  expenses.forEach(({ bill, amount }) => expenseMap.set(bill.id, (expenseMap.get(bill.id) || 0) + amount));

  transfers.forEach(({ receivingBill, sendingBill, amountReceived, amountSent }) => {
    transferMap.set(receivingBill.id, {
      income: (transferMap.get(receivingBill.id)?.income || 0) + amountReceived,
      outcome: transferMap.get(receivingBill.id)?.outcome || 0,
    });
    transferMap.set(sendingBill.id, {
      income: transferMap.get(sendingBill.id)?.income || 0,
      outcome: (transferMap.get(sendingBill.id)?.outcome || 0) + amountSent,
    });
  });

  return bills.map(bill => {
    const incomeSum = (incomeMap.get(bill.id) || 0) + (transferMap.get(bill.id)?.income || 0);
    const outcomeSum = (expenseMap.get(bill.id) || 0) + (transferMap.get(bill.id)?.outcome || 0);
    return { ...bill, incomeSum, outcomeSum, transSum: incomeSum - outcomeSum, currentAmount: bill.amount + incomeSum - outcomeSum };
  });
};

export const fetchBills = async (req: Request, res: Response) => {
  try {
    const userId = await getUserId(req.cookies['accessToken']);
    res.send({ bills: await getModifiedBills(userId) });
  } catch (error) {
    console.error("Error fetching bills:", error);
    res.status(500).send({ error: "Failed to fetch bills" });
  }
};

export const fetchBillTransactions = async (req: Request, res: Response) => {
  try {
    const userId = await getUserId(req.cookies['accessToken']);
    const billId = req.params.id;
    const count = Number(req.query.count) ?? 50;

    const [transfers, incomes, expenses] = await Promise.all([
      repositories.transfer.find({ where: { user: { id: userId } } }),
      repositories.income.find({ where: { user: { id: userId } } }),
      repositories.expense.find({ where: { user: { id: userId } } }),
    ]);

    const transactions = [
      ...processTransactions(incomes, billId, 'income'),
      ...processTransactions(expenses, billId, 'expense', -1),
    ]
      .sort((a, b) => Number(a.date) - Number(b.date))
      .slice(0, count);

    res.send({ transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).send({ error: "Failed to fetch transactions" });
  }
};

export const fetchTotalBillsAmount = async (req: Request, res: Response) => {
  try {
    const userId = await getUserId(req.cookies['accessToken']);
    const userData = await repositories.user.findOne({ where: { id: userId } });
    const currentCurrencyCode = req.query.currency ?? userData?.defaultCurrency.code;

    const modifiedBills = await getModifiedBills(userId);
    const userCurrencies = userData?.currencies.map(currency => currency.code);
    if (!userCurrencies) return;

    const rates = await getCurrencies(userCurrencies);
    let totalSum = 0;

    modifiedBills.forEach(bill => {
      const billRate = rates.find(rate => rate.currency.code === bill.currency.code)?.rate;
      const currentRate = rates.find(rate => rate.currency.code === currentCurrencyCode)?.rate;
      if (billRate && currentRate) {
        totalSum += bill.currentAmount / (billRate / currentRate);
      }
    });

    res.send({ total: { amount: totalSum, currencyCode: currentCurrencyCode } });
  } catch (error) {
    console.error("Error fetching total sum:", error);
    res.status(500).send({ error: "Failed to fetch total sum" });
  }
};

export const addBill = async (req: Request, res: Response) => {
  const accessToken = req.cookies['accessToken'];
  const userId = await getUserId(accessToken).then((result) => result);
  const { randomUUID } = new ShortUniqueId({ length: 5 });

  const { amount, currencyId, name } = req.body;

  const bill = await repositories.bill.save({ ...req.body, id: randomUUID(), user: { id: userId }, name, amount, currency: { id: currencyId } });

  res.send(bill);
}

export const updateBill = async (req: Request, res: Response) => {
  const id = req.params.id as unknown;
  const data = req.body;

  await repositories.bill.update(id as string, { ...data });
  const bill = await repositories.bill.findOne({ where: { id: id as string | undefined } });

  res.send({ bill });
}

export const uploadBillIcon = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const id = req.params.id as string;
    const username = id || "default";

    // Загружаем файл в S3
    const customIconUrl = await uploadToS3(req.file, username);

    // Обновляем БД
    await repositories.bill.update({ id }, { customIcon: customIconUrl });

    const bill = await repositories.bill.findOne({ where: { id } });

    res.json({ bill });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Upload failed" });
  }
}

export const deleteBill = async (req: Request, res: Response) => {
  const id = req.params.id as unknown;

  const bill = await repositories.bill.findOne({
    where: { id: id as string },
    relations: ['sendingTransfers', 'receivingTransfers', 'expenses', 'incomes'],
  });

  if (bill?.sendingTransfers.length) {
    await repositories.transfer.softRemove(bill?.sendingTransfers);
  }

  if (bill?.receivingTransfers.length) {
    await repositories.transfer.softRemove(bill?.receivingTransfers);
  }

  if (bill?.expenses.length) {
    await repositories.expense.softRemove(bill?.expenses);
  }

  if (bill?.incomes.length) {
    await repositories.income.softRemove(bill?.incomes);
  }

  await repositories.bill.softDelete({ id: id as string });

  res.send({
    message: 'success'
  });
}