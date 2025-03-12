export interface Expense {
  name: string,
  amount: number,
  createdDate: string,
  userId?: number,
  categoryId?: number,
  subcategoryId?: number,
  billId?: number,
  quantity: number,
  unitId?: number,
}