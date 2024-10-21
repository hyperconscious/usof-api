import { DataSource } from 'typeorm';
import config from './env.config';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: config.host,
  port: Number(config.database.port),
  username: config.database.user,
  password: config.database.pass,
  database: config.database.name,
  entities: ['src/entities/*.ts'],
  subscribers: ['src/subscribers/*.ts'],
  migrations: ['src/migrations/*.ts'],
  synchronize: config.env === 'development',
  logging: config.env === 'development',
});
