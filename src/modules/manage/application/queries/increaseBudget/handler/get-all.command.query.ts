import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllQuery } from '../get-all.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { IncreaseBudgetEntity } from '@src/modules/manage/domain/entities/increase-budget.entity';
import { HttpStatus, Inject } from '@nestjs/common';
import { READ_INCREASE_BUDGET_REPOSITORY } from '../../../constants/inject-key.const';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { IReadIncreaseBudgetRepository } from '@src/modules/manage/domain/ports/output/increase-budget-repository.interface';
import { UserContextService } from '@src/common/infrastructure/cls/cls.service';
import { CompanyUserOrmEntity } from '@src/common/infrastructure/database/typeorm/company-user.orm';
import { DepartmentUserOrmEntity } from '@src/common/infrastructure/database/typeorm/department-user.orm';

@QueryHandler(GetAllQuery)
export class GetAllQueryHandler
  implements IQueryHandler<GetAllQuery, ResponseResult<IncreaseBudgetEntity>>
{
  constructor(
    @Inject(READ_INCREASE_BUDGET_REPOSITORY)
    private readonly _readRepo: IReadIncreaseBudgetRepository,
    private readonly _userContextService: UserContextService,
  ) {}

  async execute(
    query: GetAllQuery,
  ): Promise<ResponseResult<IncreaseBudgetEntity>> {
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
    const data = await this._readRepo.findAll(
      query.dto,
      query.manager,
      company_id,
      roles,
      department_id || undefined,
    );

    if (!data) {
      throw new ManageDomainException(
        'errors.not_found',
        HttpStatus.NOT_FOUND,
        { property: 'increase budget' },
      );
    }

    return data;
  }
}
