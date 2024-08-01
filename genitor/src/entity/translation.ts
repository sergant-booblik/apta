import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

const langs = ['en-US', 'ru-RU', 'fi-FI'];

@Entity()
export class Translation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  label!: string;

  @Column('simple-json')
  translation: { "en-US": string, "ru-RU": string, "fi-FI": string }
}
