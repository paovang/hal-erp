import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllQuery } from '../get-all.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { DocumentStatusEntity } from '@src/modules/manage/domain/entities/document-status.entity';
import { READ_DOCUMENT_STATUS_REPOSITORY } from '../../../constants/inject-key.const';
import { Inject } from '@nestjs/common';
import { IReadDocumentStatusRepository } from '@src/modules/manage/domain/ports/output/document-status-repository.interface';

@QueryHandler(GetAllQuery)
export class GetAllQueryHandler
  implements IQueryHandler<GetAllQuery, ResponseResult<DocumentStatusEntity>>
{
  constructor(
    @Inject(READ_DOCUMENT_STATUS_REPOSITORY)
    private readonly _readRepo: IReadDocumentStatusRepository,
  ) {}

  async execute(
    query: GetAllQuery,
  ): Promise<ResponseResult<DocumentStatusEntity>> {
    return await this._readRepo.findAll(query.query, query.manager);
  }
}
