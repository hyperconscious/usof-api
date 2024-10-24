import { DataSource } from 'typeorm';
import config from './env.config';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: config.host,
  port: Number(config.database.port),
  username: config.database.user,
  password: config.database.pass,
  database: config.database.name,
  entities: [__dirname + '/../entities/*.ts'],
  // subscribers: ['src/subscribers/*.ts'], // just freezing when updating post
  migrations: [__dirname + '/../migrations/**/*.ts'],
  synchronize: false,//config.env === 'development',
  logging: config.env === 'development',
});
