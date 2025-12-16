import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetReportReceiptMoneyQuery } from '../report-money.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { Inject } from '@nestjs/common';
import { REPORT_RECEIPT_REPOSITORY } from '../../../constants/inject-key.const';
import { UserContextService } from '@src/common/infrastructure/cls/cls.service';
import { IReportReceiptRepository } from '@src/modules/reports/domain/ports/output/receipt-repository.interface';
import { CompanyUserOrmEntity } from '@src/common/infrastructure/database/typeorm/company-user.orm';
import { DepartmentUserOrmEntity } from '@src/common/infrastructure/database/typeorm/department-user.orm';

@QueryHandler(GetReportReceiptMoneyQuery)
export class GetReportReceiptMoneyQueryHandler
  implements IQueryHandler<GetReportReceiptMoneyQuery, ResponseResult<any>>
{
  constructor(
    @Inject(REPORT_RECEIPT_REPOSITORY)
    private readonly _readRepo: IReportReceiptRepository,
    private readonly _userContextService: UserContextService,
  ) {}

  async execute(
    query: GetReportReceiptMoneyQuery,
  ): Promise<ResponseResult<any>> {
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
    return await this._readRepo.reportMoney(
      query.manager,
      company_id,
      roles,
      department_id || undefined,
    );
  }
}
