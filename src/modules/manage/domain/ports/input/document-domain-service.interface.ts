import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CreateDocumentDto } from '@src/modules/manage/application/dto/create/Document/create.dto';
import { EntityManager } from 'typeorm';
import { DocumentEntity } from '../../entities/document.entity';

export interface IDocumentServiceInterface {
  //   getAll(
  //     dto: DocumentTypeQueryDto,
  //     manager?: EntityManager,
  //   ): Promise<ResponseResult<DocumentTypeEntity>>;

  //   getOne(
  //     id: number,
  //     manager?: EntityManager,
  //   ): Promise<ResponseResult<DocumentTypeEntity>>;

  create(
    dto: CreateDocumentDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<DocumentEntity>>;

  //   update(
  //     id: number,
  //     dto: UpdateDocumentTypeDto,
  //     manager?: EntityManager,
  //   ): Promise<ResponseResult<DocumentTypeEntity>>;

  //   delete(id: number, manager?: EntityManager): Promise<void>;
}
