import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user';
import { Bill } from './bill';
import { Category } from './category';
import { Subcategory } from './subcategory';

@Entity()
export class Income {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name: string;

  @Column({ type: 'float', default: 0.00 })
  amount: number;

  @ManyToOne(() => User, (user) => user.incomes)
  user: User;

  @ManyToOne(() => Bill, (bill) => bill.incomes, {
    eager: true,
  })
  @JoinTable()
  bill: Bill;

  @ManyToOne(() => Category, (category) => category.incomes, {
    eager: true,
  })
  @JoinTable()
  category: Category;

  @ManyToOne(() => Subcategory, (subcategory) => subcategory.incomes, {
    eager: true,
  })
  @JoinTable()
  subcategory: Subcategory;

  @CreateDateColumn()
  createdDate: Date;

  @DeleteDateColumn()
  deletedDate: Date;
}
