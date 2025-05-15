import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Department } from './typeorm/department.orm';
import { SeederLog } from './typeorm/seeder-log.orm';

config(); // ໂຫຼດຈາກ .env
export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || '',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hal-erp',
  synchronize: Boolean(process.env.DB_SYNCHRONIZE) || false,
  logging: Boolean(process.env.DB_LOGGING || false),
  entities: [Department, SeederLog],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  migrationsTableName: 'migrations',
});
