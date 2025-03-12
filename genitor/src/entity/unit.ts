import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './user'
import { Expense } from './expense'

@Entity()
export class Unit {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.units)
  user: User;

  @OneToMany(() => Expense, (expense) => expense.unit)
  expenses: Expense[];

  @Column()
  name: string;
}