import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { EntityManager } from 'typeorm';
import { DocumentCategoryEntity } from '../../entities/document-category.entity';

export interface IWriteDocumentCategoryRepository {
  update(
    entity: DocumentCategoryEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<DocumentCategoryEntity>>;
}

export interface IReadDocumentCategoryRepository {
  findAll(
    manager: EntityManager,
  ): Promise<ResponseResult<DocumentCategoryEntity>>;
}
