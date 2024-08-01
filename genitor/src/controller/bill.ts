import { NextFunction, Request, Response } from 'express'
import { genitorDataSource } from '../../ormconfig';
import { Bill } from '../entity/bill';
import {Currency} from "../entity/currency";
import {User} from "../entity/user";
import {Transfer} from "../entity/transfer";
import {getCurrencies} from "./rate";
import { PORT } from '../index'

const billRepository = genitorDataSource.getRepository(Bill);
const userRepository = genitorDataSource.getRepository(User);
const transferRepository = genitorDataSource.getRepository(Transfer);

export const GetBills = async (req: Request, res: Response) => {
  const userId = req.params.userId as unknown as number;
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
    const transSum = incomeSum + outcomeSum;
    const initialSum = bill.amount - transSum;
    return {
      ...bill,
      incomeSum,
      outcomeSum,
      transSum,
      initialSum,
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

export const AddBill = async (req: Request, res: Response) => {
  const userId = req.params.userId as unknown;
  const { amount, currencyId } = req.body;

  const bill = await billRepository.save({ user: { id: userId as number }, amount, currency: { id: currencyId } });

  res.send(bill);
}

export const uploadBillIcon = async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.params);
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

export const DeleteBill = async (req: Request, res: Response) => {
  const id = req.params.id as unknown;

  await billRepository.softDelete({ id: id as string });

  res.send({
    message: 'success'
  });
}
