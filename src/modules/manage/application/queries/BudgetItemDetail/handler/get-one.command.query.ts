import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOneQuery } from '../get-one.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { BudgetItemDetailEntity } from '@src/modules/manage/domain/entities/budget-item-detail.entity';
import { READ_BUDGET_ITEM_DETAIL_REPOSITORY } from '../../../constants/inject-key.const';
import { HttpStatus, Inject } from '@nestjs/common';
import { IReadBudgetItemDetailRepository } from '@src/modules/manage/domain/ports/output/budget-item-detail-repository.interface';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { BudgetItemDetailOrmEntity } from '@src/common/infrastructure/database/typeorm/budget-item-detail.orm';
import { BudgetItemDetailId } from '@src/modules/manage/domain/value-objects/budget-item-detail-rule-id.vo';

@QueryHandler(GetOneQuery)
export class GetOneQueryHandler
  implements IQueryHandler<GetOneQuery, ResponseResult<BudgetItemDetailEntity>>
{
  constructor(
    @Inject(READ_BUDGET_ITEM_DETAIL_REPOSITORY)
    private readonly _readRepo: IReadBudgetItemDetailRepository,
  ) {}

  async execute(
    query: GetOneQuery,
  ): Promise<ResponseResult<BudgetItemDetailEntity>> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
      );
    }

    await findOneOrFail(query.manager, BudgetItemDetailOrmEntity, {
      id: query.id,
    });

    return await this._readRepo.findOne(
      new BudgetItemDetailId(query.id),
      query.manager,
    );
  }
}
