import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { DeleteCommand } from '../delete.command';
import { HttpStatus, Inject } from '@nestjs/common';
import { WRITE_BUDGET_APPROVAL_RULE_REPOSITORY } from '../../../constants/inject-key.const';
import { IWriteBudgetApprovalRuleRepository } from '@src/modules/manage/domain/ports/output/budget-approval-rule.interface';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { BudgetApprovalRuleOrmEntity } from '@src/common/infrastructure/database/typeorm/budget-approval-rule.orm';
import { BudgetApprovalRuleId } from '@src/modules/manage/domain/value-objects/budget-approval-rule-id.vo';

@CommandHandler(DeleteCommand)
export class DeleteCommandHandler
  implements IQueryHandler<DeleteCommand, void>
{
  constructor(
    @Inject(WRITE_BUDGET_APPROVAL_RULE_REPOSITORY)
    private readonly _write: IWriteBudgetApprovalRuleRepository,
  ) {}
  async execute(query: DeleteCommand): Promise<void> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
      );
    }
    /** Check Exits CategoryId Id */
    await findOneOrFail(query.manager, BudgetApprovalRuleOrmEntity, {
      id: query.id,
    });

    return await this._write.delete(
      new BudgetApprovalRuleId(query.id),
      query.manager,
    );
  }
}
