import {Column, DeleteDateColumn, Entity, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import { Category } from './category';
import { Expense } from './expense';
import { Income } from './income';

@Entity()
export class Subcategory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name: string;

  @Column({ default: null })
  emoji: string;

  @ManyToOne(() => Category, (category) => category.subcategories)
  category: Category;

  @OneToMany(() => Expense, (expense) => expense.subcategory)
  expenses: Expense[];

  @OneToMany(() => Income, (income) => income.subcategory)
  incomes: Income[];

  @DeleteDateColumn()
  deletedDate: Date;
}
