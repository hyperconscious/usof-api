import { DataSource } from 'typeorm';
import config from './config';

export default new DataSource({
  type: 'mysql',
  host: config.host,
  port: Number(config.port),
  username: config.database.user,
  password: config.database.pass,
  database: config.database.name,
  entities: ['src/entity/**/*.ts'],
  migrations: ['src/migration/*.ts'],
  synchronize: false,
  logging: true,
});
