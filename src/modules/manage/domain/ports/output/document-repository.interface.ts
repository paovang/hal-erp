import { EntityManager } from 'typeorm';
import { DocumentEntity } from '../../entities/document.entity';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { DocumentQueryDto } from '@src/modules/manage/application/dto/query/document.dto';
import { DocumentId } from '../../value-objects/document-id.vo';

export interface IWriteDocumentRepository {
  create(
    entity: DocumentEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<DocumentEntity>>;

  update(
    entity: DocumentEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<DocumentEntity>>;

  delete(id: DocumentId, manager: EntityManager): Promise<void>;
}

export interface IReadDocumentRepository {
  findAll(
    query: DocumentQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<DocumentEntity>>;

  findOne(
    id: DocumentId,
    manager: EntityManager,
  ): Promise<ResponseResult<DocumentEntity>>;
}
