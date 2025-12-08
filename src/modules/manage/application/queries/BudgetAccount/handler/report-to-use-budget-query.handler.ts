import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { READ_BUDGET_ACCOUNT_REPOSITORY } from '../../../constants/inject-key.const';
import { IReadBudgetAccountRepository } from '@src/modules/manage/domain/ports/output/budget-account-repository.interface';
import { UserContextService } from '@src/common/infrastructure/cls/cls.service';
import { Inject } from '@nestjs/common';
import { ReportToUseBudget } from '@src/common/application/interfaces/report-budget.interface';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { GetReportToUseBudgetQuery } from '../report-to-use-budget.query';

@QueryHandler(GetReportToUseBudgetQuery)
export class GetReportToUseBudgetQueryHandler
  implements
    IQueryHandler<GetReportToUseBudgetQuery, ResponseResult<ReportToUseBudget>>
{
  constructor(
    @Inject(READ_BUDGET_ACCOUNT_REPOSITORY)
    private readonly _readRepo: IReadBudgetAccountRepository,
    private readonly _userContextService: UserContextService,
  ) {}

  async execute(
    query: GetReportToUseBudgetQuery,
  ): Promise<ResponseResult<ReportToUseBudget>> {
    const data = await this._readRepo.getReportToUseBudget(
      query.query,
      query.manager,
    );

    return data;
  }
}
