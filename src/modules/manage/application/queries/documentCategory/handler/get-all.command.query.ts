import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { Inject } from '@nestjs/common';
import { READ_DOCUMENT_CATEGORY_REPOSITORY } from '../../../constants/inject-key.const';
import { GetAllQuery } from '../get-all.query';
import { IReadDocumentCategoryRepository } from '@src/modules/manage/domain/ports/output/document-category-repository.interface';
import { DocumentCategoryEntity } from '@src/modules/manage/domain/entities/document-category.entity';

@QueryHandler(GetAllQuery)
export class GetAllQueryHandler
  implements IQueryHandler<GetAllQuery, ResponseResult<DocumentCategoryEntity>>
{
  constructor(
    @Inject(READ_DOCUMENT_CATEGORY_REPOSITORY)
    private readonly _readRepo: IReadDocumentCategoryRepository,
  ) {}

  async execute(
    query: GetAllQuery,
  ): Promise<ResponseResult<DocumentCategoryEntity>> {
    return await this._readRepo.findAll(query.manager);
  }
}
