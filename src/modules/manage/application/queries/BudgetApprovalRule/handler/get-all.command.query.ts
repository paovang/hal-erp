import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllQuery } from '../get-all.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { BudgetApprovalRuleEntity } from '@src/modules/manage/domain/entities/budget-approval-rule.entity';
import { HttpStatus, Inject } from '@nestjs/common';
import { READ_BUDGET_APPROVAL_RULE_REPOSITORY } from '../../../constants/inject-key.const';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { IReadBudgetApprovalRuleRepository } from '@src/modules/manage/domain/ports/output/budget-approval-rule.interface';

@QueryHandler(GetAllQuery)
export class GetAllQueryHandler
  implements
    IQueryHandler<GetAllQuery, ResponseResult<BudgetApprovalRuleEntity>>
{
  constructor(
    @Inject(READ_BUDGET_APPROVAL_RULE_REPOSITORY)
    private readonly _readRepo: IReadBudgetApprovalRuleRepository,
  ) {}

  async execute(
    query: GetAllQuery,
  ): Promise<ResponseResult<BudgetApprovalRuleEntity>> {
    const data = await this._readRepo.findAll(query.dto, query.manager);

    if (!data) {
      throw new ManageDomainException('error.not_found', HttpStatus.NOT_FOUND);
    }

    return data;
  }
}
