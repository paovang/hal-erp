import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOneQuery } from '../get-one.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { BudgetApprovalRuleEntity } from '@src/modules/manage/domain/entities/budget-approval-rule.entity';
import { HttpStatus, Inject } from '@nestjs/common';
import { READ_BUDGET_APPROVAL_RULE_REPOSITORY } from '../../../constants/inject-key.const';
import { IReadBudgetApprovalRuleRepository } from '@src/modules/manage/domain/ports/output/budget-approval-rule.interface';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { BudgetApprovalRuleOrmEntity } from '@src/common/infrastructure/database/typeorm/budget-approval-rule.orm';
import { BudgetApprovalRuleId } from '@src/modules/manage/domain/value-objects/budget-approval-rule-id.vo';

@QueryHandler(GetOneQuery)
export class GetOneQueryHandler
  implements
    IQueryHandler<GetOneQuery, ResponseResult<BudgetApprovalRuleEntity>>
{
  constructor(
    @Inject(READ_BUDGET_APPROVAL_RULE_REPOSITORY)
    private readonly _readRepo: IReadBudgetApprovalRuleRepository,
  ) {}

  async execute(
    query: GetOneQuery,
  ): Promise<ResponseResult<BudgetApprovalRuleEntity>> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
      );
    }

    await findOneOrFail(query.manager, BudgetApprovalRuleOrmEntity, {
      id: query.id,
    });

    return await this._readRepo.findOne(
      new BudgetApprovalRuleId(query.id),
      query.manager,
    );
  }
}
