// TODO create a folder for routing
// TODO add bearer to protect api

import { Router } from 'express';
import { authLogin, authLogout, authRefresh, authRegister, verifyToken } from './controller/auth'
import { getMyProfile, updateProfile } from './controller/users';
import { getPinnedCurrencies } from './controller/currency';
import {
  addBill,
  deleteBill,
  fetchBills,
  fetchBillTransactions,
  fetchTotalBillsAmount,
  updateBill,
  uploadBillIcon
} from './controller/bill';
import { AddTransfer, DeleteTransfer, GetTransfers, updateTransfer } from './controller/transfer';
import { addCategory, deleteCategory, getCategories, updateCategory } from './controller/category';
import { addSubcategory, deleteSubcategory, getSubCategories, updateSubcategory } from './controller/subcategory';
import { addExpense, deleteExpense, getExpenses, updateExpense } from './controller/expense';
import { addIncome, deleteIncome, getIncomes, updateIncome } from './controller/income';
import multer from 'multer';

const storage = multer.diskStorage({
  destination: './.uploads/icon',
  filename(req, file, callback) {
    callback(null, Date.now() + '_' + file.originalname);
  },

});
const uploadIcon = multer({ storage });

export const routes = (router: Router) => {
  router.post('/api/auth/register/', authRegister);
  router.post('/api/auth/login/', authLogin);
  router.get('/api/auth/verify/', verifyToken);
  router.post('/api/auth/refresh/', authRefresh);
  router.get('/api/auth/logout/', authLogout);

  router.get('/api/users/profile/my/', getMyProfile);
  router.put('/api/users/profile/my/', updateProfile);

  router.get('/api/currency', getPinnedCurrencies);

  router.post('/api/bill/', addBill);
  router.get('/api/bill?:closed', fetchBills);
  router.get('/api/bill/total?:currency', fetchTotalBillsAmount);
  router.put('/api/bill/:id/', updateBill);
  router.delete('/api/bill/:id', deleteBill);
  router.post('/api/bill/:id/icon', uploadIcon.single('icon'), uploadBillIcon);

  router.get('/api/bill/:id/transactions?:count', fetchBillTransactions);

  router.get('/api/:userId/transfer', GetTransfers);
  router.post('/api/:userId/transfer', AddTransfer);
  router.put('/api/:userId/transfer/:id', updateTransfer);
  router.delete('/api/transfer/:id', DeleteTransfer);


  router.get('/api/:userId/category', getCategories);
  router.post('/api/:userId/category', addCategory);
  router.put('/api/category/:id', updateCategory);
  router.delete('/api/category/:id', deleteCategory);

  router.get('/api/subcategory', getSubCategories);
  router.post('/api/subcategory', addSubcategory);
  router.put('/api/subcategory/:id', updateSubcategory);
  router.delete('/api/subcategory/:id', deleteSubcategory);

  router.get('/api/:userId/expense', getExpenses);
  router.post('/api/:userId/expense', addExpense);
  router.put('/api/:userId/expense/:id', updateExpense);
  router.delete('/api/expense/:id', deleteExpense);

  router.get('/api/:userId/income', getIncomes);
  router.post('/api/:userId/income', addIncome);
  router.put('/api/:userId/income/:id', updateIncome);
  router.delete('/api/income/:id', deleteIncome);
}

