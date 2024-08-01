import { DataSource } from 'typeorm';

//TODO replace to env
export const genitorDataSource = new DataSource({
  "type": "mysql",
  "host": "localhost",
  "port": 3306,
  "database": "genitor",
  "username": "genitor",
  "password": "mopx12",
  "entities": [
    "src/entity/*.ts"
  ],
  "logging": false,
  "synchronize": true
});
