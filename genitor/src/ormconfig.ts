import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

export const genitorDataSource = new DataSource({
  type: 'mysql',
  host: process.env.ORM_CONFIG_HOST!,
  port: Number(process.env.ORM_CONFIG_PORT),
  database: process.env.ORM_CONFIG_DATABASE!,
  username: process.env.ORM_CONFIG_USERNAME!,
  password: process.env.ORM_CONFIG_PASSWORD!,
  entities: ['src/entity/*.ts'],
  logging: false,
  synchronize: true,
});
