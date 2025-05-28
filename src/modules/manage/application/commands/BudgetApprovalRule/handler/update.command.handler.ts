import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { UpdateCommand } from '../update.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { BudgetApprovalRuleEntity } from '@src/modules/manage/domain/entities/budget-approval-rule.entity';
import { HttpStatus, Inject } from '@nestjs/common';
import { WRITE_BUDGET_APPROVAL_RULE_REPOSITORY } from '../../../constants/inject-key.const';
import { IWriteBudgetApprovalRuleRepository } from '@src/modules/manage/domain/ports/output/budget-approval-rule.interface';
import { BudgetApprovalRuleDataMapper } from '../../../mappers/budget-approval-rule.mapper';
import { BudgetApprovalRuleId } from '@src/modules/manage/domain/value-objects/budget-approval-rule-id.vo';
import { BudgetApprovalRuleOrmEntity } from '@src/common/infrastructure/database/typeorm/budget-approval-rule.orm';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { DepartmentOrmEntity } from '@src/common/infrastructure/database/typeorm/department.orm';
import { DepartmentUserOrmEntity } from '@src/common/infrastructure/database/typeorm/department-user.orm';

@CommandHandler(UpdateCommand)
export class UpdateCommandHandler
  implements
    IQueryHandler<UpdateCommand, ResponseResult<BudgetApprovalRuleEntity>>
{
  constructor(
    @Inject(WRITE_BUDGET_APPROVAL_RULE_REPOSITORY)
    private readonly _write: IWriteBudgetApprovalRuleRepository,
    private readonly _dataMapper: BudgetApprovalRuleDataMapper,
  ) {}

  async execute(
    query: UpdateCommand,
  ): Promise<ResponseResult<BudgetApprovalRuleEntity>> {
    const { min_amount, max_amount } = query.dto;

    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      min_amount !== undefined &&
      max_amount !== undefined &&
      min_amount >= max_amount
    ) {
      throw new ManageDomainException(
        'errors.min_amount_greater_than_max_amount',
        HttpStatus.BAD_REQUEST,
      );
    }

    await findOneOrFail(query.manager, DepartmentOrmEntity, {
      id: query.dto.department_id,
    });
    await findOneOrFail(query.manager, DepartmentUserOrmEntity, {
      user_id: query.dto.approver_id,
    });

    const entity = this._dataMapper.toEntity(query.dto);
    await entity.initializeUpdateSetId(new BudgetApprovalRuleId(query.id));
    await entity.validateExistingIdForUpdate();

    /** Check Exits Department Id */
    await findOneOrFail(query.manager, BudgetApprovalRuleOrmEntity, {
      id: entity.getId().value,
    });

    return await this._write.update(entity, query.manager);
  }
}
