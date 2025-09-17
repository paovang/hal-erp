import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetBudgetItemQuery } from '../get-budget-item.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { BudgetItemEntity } from '@src/modules/manage/domain/entities/budget-item.entity';
import { READ_BUDGET_ITEM_REPOSITORY } from '../../../constants/inject-key.const';
import { HttpStatus, Inject } from '@nestjs/common';
import { IReadBudgetItemRepository } from '@src/modules/manage/domain/ports/output/budget-item-repository.interace';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { BudgetItemId } from '@src/modules/manage/domain/value-objects/budget-item-id.vo';
import { BudgetAccountOrmEntity } from '@src/common/infrastructure/database/typeorm/budget-account.orm';

@QueryHandler(GetBudgetItemQuery)
export class GetBudgetItemQueryHandler
  implements IQueryHandler<GetBudgetItemQuery, ResponseResult<BudgetItemEntity>>
{
  constructor(
    @Inject(READ_BUDGET_ITEM_REPOSITORY)
    private readonly _readRepo: IReadBudgetItemRepository,
  ) {}

  async execute(
    query: GetBudgetItemQuery,
  ): Promise<ResponseResult<BudgetItemEntity>> {
    return await this._readRepo.getBudgetItem(query.query, query.manager);
  }
}
