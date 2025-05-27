import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOneQuery } from '../get-one.query';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { CategoryEntity } from '@src/modules/manage/domain/entities/category.entity';
import { HttpStatus, Inject } from '@nestjs/common';
import { READ_CATEGORY_REPOSITORY } from '../../../constants/inject-key.const';
import { IReadCategoryRepository } from '@src/modules/manage/domain/ports/output/category-repository.interface';
import { CategoryId } from '@src/modules/manage/domain/value-objects/category-id.vo';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { CategoryOrmEntity } from '@src/common/infrastructure/database/typeorm/category.orm';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';

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
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
      );
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
