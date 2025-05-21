import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { DepartmentOrmEntity } from './typeorm/department.orm';
import { SeederLogOrmEntity } from './typeorm/seeder-log.orm';

config(); // ໂຫຼດຈາກ .env
export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || '',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hal_erp',
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  logging: process.env.DB_LOGGING === 'true',
  entities: [DepartmentOrmEntity, SeederLogOrmEntity],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  migrationsTableName: 'migrations',
});
