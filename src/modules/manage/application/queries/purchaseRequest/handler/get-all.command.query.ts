import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllQuery } from '../get-all.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { PurchaseRequestEntity } from '@src/modules/manage/domain/entities/purchase-request.entity';
import { HttpStatus, Inject } from '@nestjs/common';
import { READ_PURCHASE_REQUEST_REPOSITORY } from '../../../constants/inject-key.const';
import { IReadPurchaseRequestRepository } from '@src/modules/manage/domain/ports/output/purchase-request-repository.interface';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { UserContextService } from '@src/common/infrastructure/cls/cls.service';
import { DepartmentUserOrmEntity } from '@src/common/infrastructure/database/typeorm/department-user.orm';
import { BudgetApprovalRuleOrmEntity } from '@src/common/infrastructure/database/typeorm/budget-approval-rule.orm';

@QueryHandler(GetAllQuery)
export class GetAllQueryHandler
  implements IQueryHandler<GetAllQuery, ResponseResult<PurchaseRequestEntity>>
{
  constructor(
    @Inject(READ_PURCHASE_REQUEST_REPOSITORY)
    private readonly _readRepo: IReadPurchaseRequestRepository,
    private readonly _userContextService: UserContextService,
  ) {}

  async execute(
    query: GetAllQuery,
  ): Promise<ResponseResult<PurchaseRequestEntity>> {
    const user = this._userContextService.getAuthUser()?.user;

    const user_id = user?.id;

    const departmentUser = await query.manager.findOne(
      DepartmentUserOrmEntity,
      {
        where: { user_id: user_id },
      },
    );

    const departmentId = departmentUser?.department_id ?? null;
    let min = 0;
    let max = 0;

    if (departmentId) {
      const budgetApprovalRule = await query.manager.findOne(
        BudgetApprovalRuleOrmEntity,
        {
          where: { department_id: departmentId, approver_id: user_id },
        },
      );

      if (budgetApprovalRule) {
        min = budgetApprovalRule?.min_amount ?? 0;
        max = budgetApprovalRule?.max_amount ?? 0;
      }
    }

    const data = await this._readRepo.findAll(
      query.dto,
      query.manager,
      departmentId!,
      user_id,
      min,
      max,
    );

    if (!data) {
      throw new ManageDomainException('error.not_found', HttpStatus.NOT_FOUND);
    }

    return data;
  }
}
