import { Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn, Column, JoinColumn } from 'typeorm';
import { Currency } from './currency';

@Entity()
export class Rate {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => Currency, (currency) => currency,{ eager: true })
  @JoinColumn()
  currency: Currency;

  @Column({ type: 'double', default: 0 })
  rate: number;

  @UpdateDateColumn()
  updatedDate: Date;
}
