import { genitorDataSource } from '@/ormconfig';
import type { Request, Response } from 'express';
import { Transfer } from '@/entity/transfer';
import { Bill } from '@/entity/bill';

const transferRepository = genitorDataSource.getRepository(Transfer);
const billRepository = genitorDataSource.getRepository(Bill);

export const getTransfers = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.userId as unknown as number;
  const transfers = await transferRepository.find({ where: { user: { id: userId } } });

  res.send(transfers);
};

export const AddTransfer = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.userId as unknown as number;
  const {
    amountSent,
    amountReceived,
    sendingBillId,
    receivingBillId,
  } = await req.body;

  //TODO check if bills belongs to user
  //TODO check data

  await genitorDataSource.transaction(async () => {
    await billRepository.decrement({ id: sendingBillId }, 'amount', amountSent);
    await billRepository.increment({ id: receivingBillId }, 'amount', amountReceived);
    const transfer = await transferRepository.save({
      user: { id: userId as number },
      sendingBill: { id: sendingBillId as string },
      receivingBill: { id: receivingBillId as string },
      amountReceived,
      amountSent,
    });

    res.send(transfer);
  });
};

export const updateTransfer = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id as unknown as number;
  const userId = req.params.userId as unknown as number;
  const updatingTransaction = await transferRepository.findOne({ where: { id } });

  const {
    newAmountSent,
    newAmountReceived,
    newSendingBillId,
    newReceivingBillId,
  } = await req.body;

  await genitorDataSource.transaction(async () => {
    if (updatingTransaction) {
      await billRepository.decrement({ id: updatingTransaction?.receivingBill.id }, 'amount', updatingTransaction.amountReceived);
      await billRepository.increment({ id: updatingTransaction?.sendingBill.id }, 'amount', updatingTransaction.amountSent);

      await billRepository.decrement({ id: newSendingBillId }, 'amount', newAmountSent);
      await billRepository.increment({ id: newReceivingBillId }, 'amount', newAmountReceived);

      await transferRepository.update(id,{
        user: { id: userId as number },
        sendingBill: { id: newSendingBillId as string },
        receivingBill: { id: newReceivingBillId as string },
        amountReceived: newAmountReceived,
        amountSent: newAmountSent,
      });

      const transfer = await transferRepository.findOne({ where: { id } });

        res.send(transfer);
    }
  });
};

export const DeleteTransfer = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id as unknown as number;
  const removingTransaction = await transferRepository.findOne({ where: { id } });

  await genitorDataSource.transaction(async () => {
    if (removingTransaction) {
      await billRepository.decrement({ id: removingTransaction?.receivingBill.id }, 'amount', removingTransaction.amountReceived);
      await billRepository.increment({ id: removingTransaction?.sendingBill.id }, 'amount', removingTransaction.amountSent);
      await transferRepository.softDelete({ id: id as number });

      res.send({
        message: 'success',
      });
    }

  });
};
