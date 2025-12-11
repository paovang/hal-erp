import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { READ_DEPARTMENT_REPOSITORY } from '@src/modules/manage/application/constants/inject-key.const';
import { HttpStatus, Inject } from '@nestjs/common';
import { IReadDepartmentRepository } from '@src/modules/manage/domain/ports/output/department-repository.interface';
import { UserContextService } from '@common/infrastructure/cls/cls.service';
import { GetReportQuery } from '../get-report.query';
import { EligiblePersons } from '../../../constants/status-key.const';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { ReportDepartmentBudget } from '@src/common/application/interfaces/report-department-budget.interface';

@QueryHandler(GetReportQuery)
export class GetReportQueryHandler
  implements IQueryHandler<GetReportQuery, ReportDepartmentBudget[]>
{
  constructor(
    @Inject(READ_DEPARTMENT_REPOSITORY)
    private readonly _readRepo: IReadDepartmentRepository,
    private readonly _userContextService: UserContextService,
  ) {}

  async execute(query: GetReportQuery): Promise<ReportDepartmentBudget[]> {
    const user = this._userContextService.getAuthUser()?.user;
    const roles = user?.roles?.map((r: any) => r.name) ?? [];

    if (
      !roles.includes(EligiblePersons.SUPER_ADMIN) &&
      !roles.includes(EligiblePersons.ADMIN)
    ) {
      throw new ManageDomainException('errors.forbidden', HttpStatus.FORBIDDEN);
    }

    return await this._readRepo.getReport(query.query, query.manager);
  }
}
