import { ResponseResult } from '@src/common/application/interfaces/pagination.interface';
import { DocumentTypeEntity } from '@src/modules/manage/domain/entities/document-type.entity';
import { EntityManager } from 'typeorm';
import { DocumentTypeId } from '../../value-objects/document-type-id.vo';

export interface IWriteDocumentTypeRepository {
  create(
    entity: DocumentTypeEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<DocumentTypeEntity>>;

//   update(
//     entity: DocumentTypeEntity,
//     manager: EntityManager,
//   ): Promise<ResponseResult<DocumentTypeEntity>>;

//   delete(id: DocumentTypeId, manager: EntityManager): Promise<void>;
}