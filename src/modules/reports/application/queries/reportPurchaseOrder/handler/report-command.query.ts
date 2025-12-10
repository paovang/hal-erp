import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ReportPurchaseOrderEntity } from '@src/modules/reports/domain/entities/report-purchase-order.entity';
import { REPORT_PURCHASE_ORDER_REPOSITORY } from '../../../constants/inject-key.const';
import { UserContextService } from '@src/common/infrastructure/cls/cls.service';
import { GetReportQuery } from '../report.query';
import { Inject } from '@nestjs/common';
import { IReportPurchaseOrderRepository } from '@src/modules/reports/domain/ports/output/purchase-order-repository.interface';
import { DepartmentUserOrmEntity } from '@src/common/infrastructure/database/typeorm/department-user.orm';
import { CompanyUserOrmEntity } from '@src/common/infrastructure/database/typeorm/company-user.orm';

@QueryHandler(GetReportQuery)
export class GetReportQueryHandler
  implements
    IQueryHandler<GetReportQuery, ResponseResult<ReportPurchaseOrderEntity>>
{
  constructor(
    @Inject(REPORT_PURCHASE_ORDER_REPOSITORY)
    private readonly _readRepo: IReportPurchaseOrderRepository,
    private readonly _userContextService: UserContextService,
  ) {}

  async execute(
    query: GetReportQuery,
  ): Promise<ResponseResult<ReportPurchaseOrderEntity>> {
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
    return await this._readRepo.report(
      query.dto,
      query.manager,
      company_id,
      roles,
      department_id || undefined,
    );
  }
}
