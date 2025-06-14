import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { EntityManager } from 'typeorm';
import { DocumentEntity } from '../../entities/document.entity';
import { DocumentQueryDto } from '@src/modules/manage/application/dto/query/document.dto';
import { CreateDocumentDto } from '@src/modules/manage/application/dto/create/Document/create.dto';
import { UpdateDocumentDto } from '@src/modules/manage/application/dto/create/Document/update.dto';

export interface IDocumentServiceInterface {
  getAll(
    dto: DocumentQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<DocumentEntity>>;

  getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<DocumentEntity>>;

  create(
    dto: CreateDocumentDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<DocumentEntity>>;

  update(
    id: number,
    dto: UpdateDocumentDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<DocumentEntity>>;

  delete(id: number, manager?: EntityManager): Promise<void>;
}
