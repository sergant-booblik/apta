import type { Category, CategoryType, Subcategory } from '@/types/category';
import { defineStore } from 'pinia';
import { api } from '@/api';
import type { Unit } from '@/types/unit';

interface CategoryState {
  categories: Category[],
  subcategories: Subcategory[],
  units: Unit[],
}

export const useCategoryStore = defineStore('category', {
  state: (): CategoryState => ({
    categories: [],
    subcategories: [],
    units: [],
  }),
  getters: {
    getCertainUnit: (state: CategoryState): (id: number | undefined) => Unit | undefined => (id: number | undefined): Unit | undefined => state.units.find((unit) => unit.id === id),
  },
  actions: {
    async fetchCategories(type: CategoryType) {
      return new Promise((resolve, reject) => {
        api.fetchCategories({ type })
          .then((response) => {
            this.categories = response.categories;
            resolve(response);
          }).catch((error) => reject(error));
      });
    },
    async fetchSubcategories(categoryId: number) {
      return new Promise((resolve, reject) => {
        api.fetchSubcategories({ categoryId })
          .then((response) => {
            this.subcategories = response.subcategories;
            resolve(response);
          }).catch((error) => reject(error));
      });
    },
    async fetchUnits() {
      return new Promise((resolve, reject) => {
        api.fetchUnits()
          .then((response) => {
            this.units = response.units;
            resolve(response);
          }).catch((error) => reject(error));
      });
    },
    async addCategory(category: Partial<Category>): Promise<Category> {
      return new Promise((resolve, reject) => {
        api.addCategory({ category })
          .then((response) => {
            this.categories.push(response.category);
            resolve(response.category);
          }).catch((error) => reject(error));
      });
    },
    async addSubcategory(subcategory: Partial<Subcategory>): Promise<Subcategory> {
      return new Promise((resolve, reject) => {
        api.addSubcategory({ subcategory })
          .then((response) => {
            this.subcategories.push(response.subcategory);
            resolve(response.subcategory);
          }).catch((error) => reject(error));
      });
    },
    clearCategories() {
      this.categories = [];
      this.subcategories = [];
      this.units = [];
    },
  },
});
