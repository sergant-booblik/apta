import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { genitorDataSource } from '../ormconfig';
import { routes } from './routes';

export const PORT = 8000;

genitorDataSource.initialize().then(() => {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());
  app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:8080', 'http://localhost:4200', 'http://localhost:8000', 'http://localhost:5173'],
    credentials: true,
  }));
  app.use(express.static('.uploads'));

  routes(app);

  app.listen(PORT, () => {
    console.log('Listening to port 8000');
  });
});
