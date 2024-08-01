import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Bill } from './bill';
import { User } from './user';

@Entity()
export class Transfer {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "float", default: 0.00 })
  amountSent!: number;

  @Column({ type: "float", default: 0.00 })
  amountReceived!: number;

  @ManyToOne(() => User, (user) => user.transfers)
  user: User;

  @ManyToOne(() => Bill, (bill) => bill.sendingBills, {
    eager: true,
  })
  @JoinTable()
  sendingBill: Bill;

  @ManyToOne(() => Bill, (bill) => bill.receivingBills, {
    eager: true,
  })
  @JoinTable()
  receivingBill: Bill;

  @CreateDateColumn()
  createdDate: Date;

  @DeleteDateColumn()
  deletedDate: Date;
}
