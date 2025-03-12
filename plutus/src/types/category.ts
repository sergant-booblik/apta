export type CategoryType = 'expense' | 'income';

export type SubcategoryType = 'transferReceived' | 'transferSend';

export interface Category {
  id: number,
  type: CategoryType,
  name: string,
  emoji: string,
}

export interface Subcategory {
  id: number,
  name: string,
  emoji: string,
  categoryId: number,
}