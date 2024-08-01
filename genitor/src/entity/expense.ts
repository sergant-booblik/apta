import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { User } from './user';
import { Bill } from './bill';
import { Category } from './category';
import { Subcategory } from './subcategory';

@Entity()
export class Expense {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name: string;

  @Column({ type: 'float', default: 0.00 })
  amount: number;

  @ManyToOne(() => User, (user) => user.expenses)
  user: User;

  @ManyToOne(() => Bill, (bill) => bill.expenses, {
    eager: true,
  })
  @JoinTable()
  bill: Bill;

  @ManyToOne(() => Category, (category) => category.expenses, {
    eager: true,
  })
  @JoinTable()
  category: Category;

  @ManyToOne(() => Subcategory, (subcategory) => subcategory.expenses, {
    eager: true,
  })
  @JoinTable()
  subcategory: Subcategory;

  @CreateDateColumn()
  createdDate: Date;

  @DeleteDateColumn()
  deletedDate: Date;
}
