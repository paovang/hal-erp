import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllQuery } from '../get-all.query';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { CategoryEntity } from '@src/modules/manage/domain/entities/category.entity';
import { READ_CATEGORY_REPOSITORY } from '../../../constants/inject-key.const';
import { Inject, NotFoundException } from '@nestjs/common';
import { IReadCategoryRepository } from '@src/modules/manage/domain/ports/output/category-repository.interface';

@QueryHandler(GetAllQuery)
export class GetAllQueryHandler
  implements IQueryHandler<GetAllQuery, ResponseResult<CategoryEntity>>
{
  constructor(
    @Inject(READ_CATEGORY_REPOSITORY)
    private readonly _readRepo: IReadCategoryRepository,
  ) {}

  async execute(query: GetAllQuery): Promise<ResponseResult<CategoryEntity>> {
    const data = await this._readRepo.findAll(query.dto, query.manager);

    if (!data) {
      throw new NotFoundException('No categories found.');
    }

    return data;
  }
}
