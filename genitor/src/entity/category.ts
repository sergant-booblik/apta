import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm'
import { User } from "./user";
import {Subcategory} from "./subcategory";
import {subscribe} from "diagnostics_channel";
import {Expense} from "./expense";
import {Income} from "./income";

export enum CategoryType {
  EXPENSE = 'expense',
  INCOME = 'income',
}

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.categories)
  user: User;

  @Column({
    type: 'enum',
    enum: CategoryType,
  })
  type!: CategoryType;

  @Column()
  name: string;

  @Column({ default: null })
  emoji: string;

  @OneToMany(() => Subcategory, (subcategory) => subcategory.category)
  subcategories: Subcategory[];

  @OneToMany(() => Expense, (expense) => expense.category)
  expenses: Expense[];

  @OneToMany(() => Income, (income) => income.category)
  incomes: Income[];

  @DeleteDateColumn()
  deletedDate: Date;
}
