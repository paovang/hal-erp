import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { EntityManager } from 'typeorm';
import { DocumentStatusEntity } from '../../entities/document-status.entity';
import { DocumentStatusQueryDto } from '@src/modules/manage/application/dto/query/document-status.dto';

export interface IDocumentStatusServiceInterface {
  getAll(
    query: DocumentStatusQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<DocumentStatusEntity>>;
}
