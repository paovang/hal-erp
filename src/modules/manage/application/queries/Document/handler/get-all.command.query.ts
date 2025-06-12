import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllQuery } from '../get-all.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { DocumentEntity } from '@src/modules/manage/domain/entities/document.entity';
import { READ_DOCUMENT_REPOSITORY } from '../../../constants/inject-key.const';
import { Inject } from '@nestjs/common';
import { IReadDocumentRepository } from '@src/modules/manage/domain/ports/output/document-repository.interface';

@QueryHandler(GetAllQuery)
export class GetAllQueryHandler
  implements IQueryHandler<GetAllQuery, ResponseResult<DocumentEntity>>
{
  constructor(
    @Inject(READ_DOCUMENT_REPOSITORY)
    private readonly _readRepo: IReadDocumentRepository,
  ) {}

  async execute(query: GetAllQuery): Promise<ResponseResult<DocumentEntity>> {
    return await this._readRepo.findAll(query.dto, query.manager);
  }
}
