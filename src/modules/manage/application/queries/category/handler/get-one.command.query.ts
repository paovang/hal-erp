import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOneQuery } from '../get-one.query';
import { ResponseResult } from '@src/common/application/interfaces/pagination.interface';
import { CategoryEntity } from '@src/modules/manage/domain/entities/category.entity';
import { BadRequestException, Inject } from '@nestjs/common';
import { READ_CATEGORY_REPOSITORY } from '../../../constants/inject-key.const';
import { IReadCategoryRepository } from '@src/modules/manage/domain/ports/output/category-repository.interface';
import { CategoryId } from '@src/modules/manage/domain/value-objects/category-id.vo';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { CategoryOrmEntity } from '@src/common/infrastructure/database/typeorm/category.orm';

@QueryHandler(GetOneQuery)
export class GetOneQueryHandler
  implements IQueryHandler<GetOneQuery, ResponseResult<CategoryEntity>>
{
  constructor(
    @Inject(READ_CATEGORY_REPOSITORY)
    private readonly _readRepo: IReadCategoryRepository,
  ) {}

  async execute(query: GetOneQuery): Promise<ResponseResult<CategoryEntity>> {
    if (isNaN(query.id)) {
      throw new BadRequestException('id must be a number');
    }

    await findOneOrFail(query.manager, CategoryOrmEntity, {
      id: query.id,
    });

    return await this._readRepo.findOne(
      new CategoryId(query.id),
      query.manager,
    );
  }
}
