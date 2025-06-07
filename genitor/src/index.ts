import { genitorDataSource } from './ormconfig';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { routes } from './routes';
import { seedCurrenciesIfNeeded } from './utils/seed-currencies';
import { fixRateCurrency } from './utils/fix-rate-currency';
import * as process from 'node:process';

export const PORT = 8000;

genitorDataSource.initialize().then(async (dataSource) => {
  const app = express();
  await seedCurrenciesIfNeeded(dataSource).then(() => {
    fixRateCurrency(dataSource);
  });

  app.use(express.json());
  app.use(cookieParser());
  app.use(cors({
    origin: process.env.CORS_ORIGIN, // для теста
    credentials: true,
  }));
  app.use(express.static('.uploads'));

  routes(app);

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log('Listening to port 8000');
  });
});
