import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { DocumentStatusQueryDto } from '@src/modules/manage/application/dto/query/document-status.dto';
import { EntityManager } from 'typeorm';
import { DocumentStatusEntity } from '../../entities/document-status.entity';

export interface IReadDocumentStatusRepository {
  findAll(
    query: DocumentStatusQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<DocumentStatusEntity>>;
}
