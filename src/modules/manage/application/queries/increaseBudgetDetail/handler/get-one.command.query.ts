import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOneQuery } from '../get-one.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { IncreaseBudgetDetailEntity } from '@src/modules/manage/domain/entities/increase-budget-detail.entity';
import { READ_INCREASE_BUDGET_DETAIL_REPOSITORY } from '../../../constants/inject-key.const';
import { HttpStatus, Inject } from '@nestjs/common';
import { IReadIncreaseBudgetDetailRepository } from '@src/modules/manage/domain/ports/output/increase-budget-detail-repository.interface';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { IncreaseBudgetDetailOrmEntity } from '@src/common/infrastructure/database/typeorm/increase-budget-detail.orm';
import { IncreaseBudgetDetailId } from '@src/modules/manage/domain/value-objects/increase-budget-detail-id.vo';

@QueryHandler(GetOneQuery)
export class GetOneQueryHandler
  implements
    IQueryHandler<GetOneQuery, ResponseResult<IncreaseBudgetDetailEntity>>
{
  constructor(
    @Inject(READ_INCREASE_BUDGET_DETAIL_REPOSITORY)
    private readonly _readRepo: IReadIncreaseBudgetDetailRepository,
  ) {}

  async execute(
    query: GetOneQuery,
  ): Promise<ResponseResult<IncreaseBudgetDetailEntity>> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
        { property: `${query.id}` },
      );
    }

    await findOneOrFail(
      query.manager,
      IncreaseBudgetDetailOrmEntity,
      {
        id: query.id,
      },
      'increase budget detail',
    );

    const data = await this._readRepo.findOne(
      new IncreaseBudgetDetailId(query.id),
      query.manager,
    );

    return data;
  }
}
