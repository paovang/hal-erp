import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { READ_COMPANY_REPOSITORY } from '@src/modules/manage/application/constants/inject-key.const';
import { HttpStatus, Inject } from '@nestjs/common';
import { IReadCompanyRepository } from '@src/modules/manage/domain/ports/output/company-repository.interface';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { UserContextService } from '@common/infrastructure/cls/cls.service';
import { GetReportQuery } from '../get-report-company.query';
import { ReportCompanyInterface } from '@src/common/application/interfaces/report-company.intergace';
import { EligiblePersons } from '../../../constants/status-key.const';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';

@QueryHandler(GetReportQuery)
export class GetReportQueryHandler
  implements
    IQueryHandler<GetReportQuery, ResponseResult<ReportCompanyInterface>>
{
  constructor(
    @Inject(READ_COMPANY_REPOSITORY)
    private readonly _readRepo: IReadCompanyRepository,
    private readonly _userContextService: UserContextService,
  ) {}

  async execute(
    query: GetReportQuery,
  ): Promise<ResponseResult<ReportCompanyInterface>> {
    const user = this._userContextService.getAuthUser()?.user;
    const roles = user?.roles?.map((r: any) => r.name) ?? [];

    if (
      !roles.includes(EligiblePersons.SUPER_ADMIN) &&
      !roles.includes(EligiblePersons.ADMIN)
    ) {
      throw new ManageDomainException('errors.forbidden', HttpStatus.FORBIDDEN);
    }

    return await this._readRepo.getReport(query.manager);
  }
}
