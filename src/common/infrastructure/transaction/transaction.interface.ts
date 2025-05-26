import { DataSource, EntityManager } from 'typeorm';

export interface ITransactionManagerService {
  runInTransaction<T>(
    dataSource: DataSource,
    operations: (manager: EntityManager) => Promise<T>,
  ): Promise<T>;
}
