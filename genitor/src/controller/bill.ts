import { genitorDataSource } from '@/ormconfig';
import { getCurrencies } from './rate';
import { getUserId } from '@/helper/get-user-id';
import uploadToS3 from '@/middleware/upload';
import { User } from '@/entity/user';
import { Bill } from '@/entity/bill';
import { Transfer } from '@/entity/transfer';
import { Income } from '@/entity/income';
import { Expense } from '@/entity/expense';
import ShortUniqueId from 'short-unique-id';
import type { Request, Response } from 'express';

type TransactionType = 'income' | 'expense';
type TransferType = 'transferReceived' | 'transferSend';

export interface ModifiedTransaction {
  type: TransactionType,
  amount: number,
  category: string,
  subcategory: string,
  name: string,
  date: Date,
}

export interface ModifiedTransfer {
  type: TransferType,
  amount: number,
  category: string,
  subcategory: string,
  name: string,
  date: Date,
}

export interface ModifiedBill extends Bill {
  currentAmount: number,
  incomeSum: number,
  outcomeSum: number,
  transSum: number,
}

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
): ModifiedTransaction => ({
  type,
  amount,
  category: `${transaction.category.emoji} ${transaction.category.name}`,
  subcategory: `${transaction.subcategory.emoji} ${transaction.subcategory.name}`,
  name: transaction.name,
  date: transaction.createdDate,
});

const formatTransfer = (
  transfer: Transfer,
  billId: string,
): ModifiedTransfer => ({
  type: transfer.sendingBill.id === billId ? 'transferSend' : 'transferReceived' as TransferType,
  amount: transfer.sendingBill.id === billId ? transfer.amountSent * -1 : transfer.amountReceived,
  category: 'Transfer.History.transaction',
  subcategory: transfer.sendingBill.id === billId ? 'Transfer.History.sent' : 'Transfer.History.received',
  name: transfer.sendingBill.id === billId ? 'Transfer.History.to' : 'Transfer.History.from',
  date: transfer.createdDate,
});

const processTransactions = (
  transactions: Income[] | Expense[],
  billId: string,
  type: TransactionType,
  amountMultiplier = 1,
): ModifiedTransaction[] =>
  transactions
    .filter(tx => tx.bill.id === billId)
    .map(tx => formatTransaction(tx, type, tx.amount * amountMultiplier));

const processTransfers = (
  transfers: Transfer[],
  billId: string,
): ModifiedTransfer[] => transfers.filter((ts) => ts.receivingBill.id === billId || ts.sendingBill.id === billId)
  .map((ts) => formatTransfer(ts, billId));

const getModifiedBills = async (userId: number | undefined, isShowClosed: boolean): Promise<ModifiedBill[]> => {
  const [bills, transfers, incomes, expenses] = await Promise.all([
    repositories.bill.find({
      where: { user: { id: userId }, ...(isShowClosed ? {} : { isClosed: false }) },
      order: { order: 'ASC' },
    }),
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

export const fetchBills = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = await getUserId(req.cookies['accessToken']);
    const isShowClosed = req.query.closed === 'true';
    res.send({ bills: await getModifiedBills(userId, isShowClosed) });
  } catch (error) {
    res.status(500).send({ error: `Failed to fetch bills: ${error}` });
  }
};

export const fetchBillTransactions = async (req: Request, res: Response): Promise<void> => {
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
      ...processTransfers(transfers, billId),
    ]
      .sort((a, b) => Number(b.date) - Number(a.date))
      .slice(0, count);

    res.send({ transactions });
  } catch (error) {
    res.status(500).send({ error: `Failed to fetch transactions: ${error}` });
  }
};

export const fetchTotalBillsAmount = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = await getUserId(req.cookies['accessToken']);
    const userData = await repositories.user.findOne({ where: { id: userId } });
    const currentCurrencyCode = req.query.currency ?? userData?.defaultCurrency.code;
    const isShowClosed = req.query.closed === 'true';

    const modifiedBills = await getModifiedBills(userId, isShowClosed);
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
    res.status(500)
      .send({ error: `Failed to fetch total sum: ${error}` });
  }
};

export const addBill = async (req: Request, res: Response): Promise<void> => {
  const accessToken = req.cookies['accessToken'];
  const userId = await getUserId(accessToken).then((result) => result);
  const { randomUUID } = new ShortUniqueId({ length: 5 });

  const { amount, currencyId, name } = req.body;

  const bill = await repositories.bill.save({ ...req.body, id: randomUUID(), user: { id: userId }, name, amount, currency: { id: currencyId } });

  res.send(bill);
};

export const updateBill = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id as unknown;
  const data = req.body;

  await repositories.bill.update(id as string, { ...data });
  const bill = await repositories.bill.findOne({ where: { id: id as string | undefined } });

  res.send({ bill });
};

export const reorderBills = async (req: Request, res: Response): Promise<void> => {
  const accessToken = req.cookies['accessToken'];
  const userId = await getUserId(accessToken).then((result) => result);
  const billId = req.body.id;
  const newOrder = req.body.order;
  const bills = await repositories.bill.find({
    where: { user: { id: userId }, ...{ isClosed: false } },
    order: { order: 'ASC' },
  });

  const movingBill = bills.find((bill) => bill.id === billId);
  if (!movingBill) {
    throw new Error('Bill not found');
  }

  const filtered = bills.filter((bill) => bill.id !== billId);
  filtered.splice(newOrder - 1, 0, movingBill);

  for (let i = 0; i < filtered.length; i++) {
    const bill = filtered[i];
    bill.order = i + 1;
  }

  await repositories.bill.save(filtered);

  res.send({ filtered });
};

export const uploadBillIcon = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const id = req.params.id as string;
    const username = id || 'default';

    // Загружаем файл в S3
    const customIconUrl = await uploadToS3(req.file, username);

    // Обновляем БД
    await repositories.bill.update({ id }, { customIcon: customIconUrl });

    const bill = await repositories.bill.findOne({ where: { id } });

    res.json({ bill });
  } catch (error) {
    res.status(500).json({ error: `Upload failed: ${error}` });
  }
};

export const deleteBill = async (req: Request, res: Response): Promise<void> => {
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
    message: 'success',
  });
};