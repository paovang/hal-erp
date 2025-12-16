import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetReportCompanyQuery } from '../report-company.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { Inject } from '@nestjs/common';
import { REPORT_COMPANY_REPOSITORY } from '../../../constants/inject-key.const';
import { IReportCompanuRepository } from '@src/modules/reports/domain/ports/output/company-repository.interface';
import { CompanyUserOrmEntity } from '@src/common/infrastructure/database/typeorm/company-user.orm';
import { DepartmentUserOrmEntity } from '@src/common/infrastructure/database/typeorm/department-user.orm';
import { UserContextService } from '@src/common/infrastructure/cls/cls.service';

@QueryHandler(GetReportCompanyQuery)
export class GetReportCompanyQueryHandler
  implements IQueryHandler<GetReportCompanyQuery, ResponseResult<any>>
{
  constructor(
    @Inject(REPORT_COMPANY_REPOSITORY)
    private readonly _readRepo: IReportCompanuRepository,
    private readonly _userContextService: UserContextService,
  ) {}

  async execute(query: GetReportCompanyQuery): Promise<ResponseResult<any>> {
    const user = this._userContextService.getAuthUser()?.user;

    const user_id = user?.id;

    const departmentUser = await query.manager.findOne(
      DepartmentUserOrmEntity,
      {
        where: { user_id: user_id },
      },
    );

    const company_user = await query.manager.findOne(CompanyUserOrmEntity, {
      where: {
        user_id: user_id,
      },
    });

    const company_id = company_user?.company_id ?? undefined;
    const roles = user?.roles?.map((r: any) => r.name) ?? [];
    const department_id = departmentUser?.department_id ?? null;
    return await this._readRepo.reportCompany(
      query.manager,
      company_id,
      roles,
      department_id || undefined,
    );
  }
}
