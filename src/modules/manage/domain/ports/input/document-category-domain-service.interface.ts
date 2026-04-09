/* eslint-disable prettier/prettier */
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { EntityManager } from 'typeorm';
import { UpdateDocumentTypeDto } from '@src/modules/manage/application/dto/create/documentType/update.dto';
import { DocumentCategoryEntity } from '../../entities/document-category.entity';

export interface IDocumentCategoryServiceInterface {
  getAll(
    manager?: EntityManager,
  ): Promise<ResponseResult<DocumentCategoryEntity>>;

  update(
    id: number,
    dto: UpdateDocumentTypeDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<DocumentCategoryEntity>>;
}
