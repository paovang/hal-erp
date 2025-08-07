import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOneQuery } from '../get-one.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { IncreaseBudgetEntity } from '@src/modules/manage/domain/entities/increase-budget.entity';
import { HttpStatus, Inject } from '@nestjs/common';
import { READ_INCREASE_BUDGET_REPOSITORY } from '../../../constants/inject-key.const';
import { IReadIncreaseBudgetRepository } from '@src/modules/manage/domain/ports/output/increase-budget-repository.interface';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { IncreaseBudgetOrmEntity } from '@src/common/infrastructure/database/typeorm/increase-budget.orm';
import { IncreaseBudgetId } from '@src/modules/manage/domain/value-objects/increase-budget-id.vo';

@QueryHandler(GetOneQuery)
export class GetOneQueryHandler
  implements IQueryHandler<GetOneQuery, ResponseResult<IncreaseBudgetEntity>>
{
  constructor(
    @Inject(READ_INCREASE_BUDGET_REPOSITORY)
    private readonly _readRepo: IReadIncreaseBudgetRepository,
  ) {}

  async execute(
    query: GetOneQuery,
  ): Promise<ResponseResult<IncreaseBudgetEntity>> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
        { property: `${query.id}` },
      );
    }

    await findOneOrFail(query.manager, IncreaseBudgetOrmEntity, {
      id: query.id,
    });

    return await this._readRepo.findOne(
      new IncreaseBudgetId(query.id),
      query.manager,
    );
  }
}
