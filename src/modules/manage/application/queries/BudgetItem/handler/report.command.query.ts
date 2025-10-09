import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetReportQuery } from '../report.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { READ_BUDGET_ITEM_REPOSITORY } from '../../../constants/inject-key.const';
import { Inject } from '@nestjs/common';
import { BudgetItemEntity } from '@src/modules/manage/domain/entities/budget-item.entity';
import { IReadBudgetItemRepository } from '@src/modules/manage/domain/ports/output/budget-item-repository.interace';

@QueryHandler(GetReportQuery)
export class GetReportQueryHandler
  implements IQueryHandler<GetReportQuery, ResponseResult<BudgetItemEntity>>
{
  constructor(
    @Inject(READ_BUDGET_ITEM_REPOSITORY)
    private readonly _readRepo: IReadBudgetItemRepository,
  ) {}

  async execute(
    query: GetReportQuery,
  ): Promise<ResponseResult<BudgetItemEntity>> {
    return await this._readRepo.report(query.query, query.manager);
  }
}
