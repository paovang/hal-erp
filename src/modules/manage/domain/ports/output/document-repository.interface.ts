import { EntityManager } from 'typeorm';
import { DocumentEntity } from '../../entities/document.entity';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';

export interface IWriteDocumentRepository {
  create(
    entity: DocumentEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<DocumentEntity>>;

  //   update(
  //     entity: DocumentTypeEntity,
  //     manager: EntityManager,
  //   ): Promise<ResponseResult<DocumentTypeEntity>>;

  //   delete(id: DocumentTypeId, manager: EntityManager): Promise<void>;
}
