import { EntityManager } from 'typeorm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { DocumentApproverEntity } from '../../entities/document-approver.entity';

export interface IWriteDocumentApproverRepository {
  create(
    entity: DocumentApproverEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<DocumentApproverEntity>>;

  //   update(
  //     entity: DocumentEntity,
  //     manager: EntityManager,
  //   ): Promise<ResponseResult<DocumentEntity>>;

  //   delete(id: DocumentId, manager: EntityManager): Promise<void>;
}
