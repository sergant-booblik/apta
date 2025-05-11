import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity, JoinTable, ManyToMany, ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Bill } from './bill';
import { Transfer } from './transfer';
import { Category } from './category';
import { Expense } from './expense';
import { Income } from './income';
import { Currency } from './currency';
import { Unit } from './unit';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ default: '' })
  name: string;

  @Column({ type: 'longtext', default: null })
  imageUrl: string;

  @Column({ unique: true })
  email!: string;

  @Column({ select: false })
  password!: string;

  @OneToMany(() => Bill, (bill) => bill.user)
  bills: Bill[];

  @ManyToMany(() => Currency,  { eager: true })
  @JoinTable()
  currencies: Currency[];

  @OneToMany(() => Transfer, (bill) => bill.user)
  transfers: Transfer[];

  @OneToMany(() => Category, (category) => category.user)
  categories: Category[];

  @OneToMany(() => Unit, (unit) => unit.user)
  units: Unit[];

  @OneToMany(() => Expense, (expense) => expense.user)
  expenses: Expense[];

  @OneToMany(() => Income, (income) => income.user)
  incomes: Income[];

  @ManyToOne(() => Currency, (currency) => currency.users, { eager: true })
  @JoinTable()
  defaultCurrency: Currency;

  @Column({ default: false })
  isBlocked: boolean;

  @Column({ default: false })
  isConfirmed: boolean;

  @Column({ default: 'en-US' })
  locale: string;

  @Column({ default: 'light' })
  theme: string;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @DeleteDateColumn()
  deletedDate: Date;
}
