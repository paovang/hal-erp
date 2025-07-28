import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { EntityManager } from 'typeorm';
import { DocumentAttachmentEntity } from '../../entities/document-attachment.entity';

export interface IWriteDocumentAttachmentRepository {
  create(
    entity: DocumentAttachmentEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<DocumentAttachmentEntity>>;
}
