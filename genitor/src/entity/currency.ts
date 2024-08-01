import {Column, Entity, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Bill} from "./bill";
import {User} from "./user";
import {Rate} from "./rate";

@Entity()
export class Currency {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  code!: string;

  @Column()
  num!: string;

  @Column()
  flag: string;

  @Column()
  pinned: boolean;

  @OneToOne(() => Rate, (rate) => rate.currency)
  rate: Rate;

  @OneToMany(() => User, (user) => user.defaultCurrency)
  users: User[];

  @OneToMany(() => Bill, (bill) => bill.currency)
  bills: Bill[];
}
