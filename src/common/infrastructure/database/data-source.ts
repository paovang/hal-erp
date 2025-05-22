import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { models } from './index';

config(); // ໂຫຼດຈາກ .env
export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.WRITE_DB_HOST || 'localhost',
  port: Number(process.env.WRITE_DB_PORT) || 5432,
  username: process.env.WRITE_DB_USERNAME || '',
  password: process.env.WRITE_DB_PASSWORD || '',
  database: process.env.WRITE_DB_NAME || 'hal_erp',
  synchronize: Boolean(process.env.WRITE_DB_SYNCHRONIZE) || false,
  logging: Boolean(process.env.WRITE_DB_LOGGING || false),
  entities: [...models],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  migrationsTableName: 'migrations',
});
