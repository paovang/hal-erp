import { ResponseResult } from '@src/common/application/interfaces/pagination.interface';
import { DocumentTypeEntity } from '@src/modules/manage/domain/entities/document-type.entity';
import { EntityManager } from 'typeorm';
import { DocumentTypeId } from '../../value-objects/document-type-id.vo';
import { DocumentTypeQueryDto } from '@src/modules/manage/application/dto/query/document-type-query.dto';

export interface IWriteDocumentTypeRepository {
  create(
    entity: DocumentTypeEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<DocumentTypeEntity>>;

  update(
    entity: DocumentTypeEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<DocumentTypeEntity>>;

  delete(id: DocumentTypeId, manager: EntityManager): Promise<void>;
}

export interface IReadDocumentTypeRepository {
  findAll(
    query: DocumentTypeQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<DocumentTypeEntity>>;

  findOne(
    id: DocumentTypeId,
    manager: EntityManager,
  ): Promise<ResponseResult<DocumentTypeEntity>>;
}