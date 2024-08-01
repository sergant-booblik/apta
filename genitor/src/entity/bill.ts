import {
  BeforeInsert,
  Column,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  OneToMany, PrimaryColumn,
  PrimaryGeneratedColumn
} from 'typeorm'
import { User } from './user';
import { Currency } from './currency';
import { Transfer } from './transfer';
import { Expense } from './expense';
import { Income } from './income';
import ShortUniqueId from 'short-unique-id'

const { randomUUID } = new ShortUniqueId({ length: 5 });

@Entity()
export class Bill {
  @PrimaryColumn('varchar', { default: randomUUID() } )
  id!: string;

  @Column({ default: 0.00, type: 'float' })
  amount!: number;

  @Column()
  name: string;

  @Column()
  subtitle: string;

  @Column()
  icon: string;

  @Column()
  customIcon: string;

  @Column()
  customColor: string;

  @ManyToOne(() => User, (user) => user.bills)
  user: User;

  @ManyToOne(() => Currency, (currency) => currency.bills, {
    eager: true,
  })
  @JoinTable()
  currency: Currency;

  @OneToMany(() => Transfer, (billTransfer) => billTransfer.amountSent)
  sendingBills: Bill[];

  @OneToMany(() => Transfer, (billTransfer) => billTransfer.amountReceived)
  receivingBills: Bill[];

  @OneToMany(() => Expense, (expense) => expense.bill)
  expenses: Expense[];

  @OneToMany(() => Income, (income) => income.bill)
  incomes: Income[];

  @DeleteDateColumn()
  deletedDate: Date;
}
