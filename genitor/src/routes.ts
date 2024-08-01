// TODO create a folder for routing
// TODO add bearer to protect api

import { Router } from 'express';
import { AuthUser, AuthLogin, AuthLogout, AuthRefresh, AuthRegister } from './controller/auth';
import { getUser, updateUser } from './controller/users';
import { getPinnedCurrencies } from './controller/currency';
import { getTranslation } from './controller/translation';
import { AddBill, DeleteBill, GetBills, UpdateBill, uploadBillIcon } from './controller/bill'
import { AddTransfer, DeleteTransfer, GetTransfers, updateTransfer } from './controller/transfer';
import { addCategory, deleteCategory, getCategories, updateCategory } from './controller/category';
import { addSubcategory, deleteSubcategory, getSubCategories, updateSubcategory } from './controller/subcategory';
import { addExpense, deleteExpense, getExpenses, updateExpense } from './controller/expense';
import { addIncome, deleteIncome, getIncomes, updateIncome } from './controller/income';
import multer from 'multer'

const storage = multer.diskStorage({
  destination: './.uploads/icon',
  filename(req, file, callback) {
    callback(null, Date.now() + '_' + file.originalname);
  },

});
const uploadIcon = multer({ storage });

export const routes = (router: Router) => {
  router.post('/api/auth/register', AuthRegister);
  router.post('/api/auth/login', AuthLogin);
  router.get('/api/auth/user', AuthUser);
  router.post('/api/auth/refresh', AuthRefresh);
  router.get('/api/auth/logout', AuthLogout);

  router.get('/api/users/:id', getUser);
  router.put('/api/users/:id', updateUser);

  router.get('/api/translation/:lang', getTranslation);

  router.get('/api/currency', getPinnedCurrencies);

  router.get('/api/:userId/bill', GetBills);
  router.post('/api/:userId/bill', AddBill);
  router.put('/api/bill/:id', UpdateBill);
  router.delete('/api/bill/:id', DeleteBill);
  router.post('/api/bill/:id/icon', uploadIcon.single('icon'), uploadBillIcon)

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

