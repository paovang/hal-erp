/* eslint-disable prettier/prettier */
import { ResponseResult } from '@src/common/application/interfaces/pagination.interface';
import { EntityManager } from 'typeorm';
import { CreateDocumentTypeDto } from '@src/modules/manage/application/dto/create/documentType/create.dto';
import { DocumentTypeEntity } from '../../entities/document-type.entity';
import { DocumentTypeQueryDto } from '@src/modules/manage/application/dto/query/document-type-query.dto';
import { UpdateDocumentTypeDto } from '@src/modules/manage/application/dto/create/documentType/update.dto';

export interface IDocumentTypeServiceInterface {
  getAll(
    dto: DocumentTypeQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<DocumentTypeEntity>>;

  getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<DocumentTypeEntity>>;

  create(
    dto: CreateDocumentTypeDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<DocumentTypeEntity>>;

  update(
    id: number,
    dto: UpdateDocumentTypeDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<DocumentTypeEntity>>;

  delete(id: number, manager?: EntityManager): Promise<void>;
}
