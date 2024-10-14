import { DataSource } from 'typeorm';
import config from './config';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: config.host,
  port: Number(config.port),
  username: config.database.user,
  password: config.database.pass,
  database: config.database.name,
  entities: ['src/entities/*.ts'],
  migrations: ['src/migration/*.ts'],
  synchronize: true,
  logging: true,
});
