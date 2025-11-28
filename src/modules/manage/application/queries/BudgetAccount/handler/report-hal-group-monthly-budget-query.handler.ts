import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { READ_BUDGET_ACCOUNT_REPOSITORY } from '../../../constants/inject-key.const';
import { IReadBudgetAccountRepository } from '@src/modules/manage/domain/ports/output/budget-account-repository.interface';
import { UserContextService } from '@src/common/infrastructure/cls/cls.service';
import { GetReportHalGroupMonthBudgetQuery } from '../report-hal-group-monthly-budget.query';
import { Inject } from '@nestjs/common';
import { ReportBudgetInterface } from '@src/common/application/interfaces/report-budget.interface';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';

@QueryHandler(GetReportHalGroupMonthBudgetQuery)
export class GetReportHalGroupMonthBudgetQueryHandler
  implements
    IQueryHandler<
      GetReportHalGroupMonthBudgetQuery,
      ResponseResult<ReportBudgetInterface>
    >
{
  constructor(
    @Inject(READ_BUDGET_ACCOUNT_REPOSITORY)
    private readonly _readRepo: IReadBudgetAccountRepository,
    private readonly _userContextService: UserContextService,
  ) {}

  async execute(
    query: GetReportHalGroupMonthBudgetQuery,
  ): Promise<ResponseResult<ReportBudgetInterface>> {
    const user = this._userContextService.getAuthUser()?.user;

    const roles = user?.roles?.map((r: any) => r.name) ?? [];

    const data = await this._readRepo.getAllForHalGroupMonthlyBudget(
      query.query,
      query.manager,
      roles,
    );

    return data;
  }
}
