import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  OneToMany, PrimaryColumn,
} from 'typeorm';
import { User } from './user';
import { Currency } from './currency';
import { Transfer } from './transfer';
import { Expense } from './expense';
import { Income } from './income';
import ShortUniqueId from 'short-unique-id';

const { randomUUID } = new ShortUniqueId({ length: 5 });

@Entity()
export class Bill {
  @PrimaryColumn('varchar', { default: randomUUID() })
  id!: string;

  @Column({ default: 0.00, type: 'float' })
  amount!: number;

  @Column()
  name!: string;

  @Column({ default: '' })
  subtitle: string;

  @Column({ default: null })
  icon: string;

  @Column({ default: null })
  customIcon: string;

  @Column({ default: null })
  customColor: string;

  @Column({ default: null })
  customFontColor: string;

  @Column()
  order: number;

  @Column({ default: false })
  isClosed: boolean;

  @ManyToOne(() => User, (user) => user.bills)
  user: User;

  @ManyToOne(() => Currency, (currency) => currency.bills, {
    eager: true,
  })
  @JoinTable()
  currency: Currency;

  @OneToMany(() => Transfer, (billTransfer) => billTransfer.sendingBill, { cascade: true })
  sendingTransfers: Transfer[];

  @OneToMany(() => Transfer, (billTransfer) => billTransfer.receivingBill, { cascade: true })
  receivingTransfers: Transfer[];

  @OneToMany(() => Expense, (expense) => expense.bill, { cascade: true })
  expenses: Expense[];

  @OneToMany(() => Income, (income) => income.bill, { cascade: true })
  incomes: Income[];

  @DeleteDateColumn()
  deletedDate: Date;
}
