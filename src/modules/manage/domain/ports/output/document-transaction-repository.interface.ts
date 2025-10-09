import { EntityManager } from 'typeorm';
import { DocumentTransactionEntity } from '../../entities/document-transaction.entity';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';

export interface IWriteDocumentTransactionRepository {
  create(
    entity: DocumentTransactionEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<DocumentTransactionEntity>>;

  //   update(
  //     entity: DocumentTransactionEntity,
  //     manager: EntityManager,
  //   ): Promise<ResponseResult<DocumentTransactionEntity>>;

  //   delete(id: DocumentId, manager: EntityManager): Promise<void>;
}
