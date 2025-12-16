import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetReportQuery } from '../report.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { READ_BUDGET_ITEM_REPOSITORY } from '../../../constants/inject-key.const';
import { Inject } from '@nestjs/common';
import { BudgetItemEntity } from '@src/modules/manage/domain/entities/budget-item.entity';
import { IReadBudgetItemRepository } from '@src/modules/manage/domain/ports/output/budget-item-repository.interace';
import { UserContextService } from '@src/common/infrastructure/cls/cls.service';
// import { DepartmentUserOrmEntity } from '@src/common/infrastructure/database/typeorm/department-user.orm';
import { CompanyUserOrmEntity } from '@src/common/infrastructure/database/typeorm/company-user.orm';
import { DepartmentUserOrmEntity } from '@src/common/infrastructure/database/typeorm/department-user.orm';

@QueryHandler(GetReportQuery)
export class GetReportQueryHandler
  implements IQueryHandler<GetReportQuery, ResponseResult<BudgetItemEntity>>
{
  constructor(
    @Inject(READ_BUDGET_ITEM_REPOSITORY)
    private readonly _readRepo: IReadBudgetItemRepository,
    private readonly _userContextService: UserContextService,
  ) {}

  async execute(
    query: GetReportQuery,
  ): Promise<ResponseResult<BudgetItemEntity>> {
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
      query.query,
      query.manager,
      company_id,
      roles,
      department_id || undefined,
    );
  }
}
