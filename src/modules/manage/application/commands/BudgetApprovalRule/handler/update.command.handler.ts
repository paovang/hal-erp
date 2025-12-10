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
import { DepartmentUserOrmEntity } from '@common/infrastructure/database/typeorm/department-user.orm';
import { _checkColumnDuplicate } from '@common/utils/check-column-duplicate-orm.util';
import { UserContextService } from '@common/infrastructure/cls/cls.service';
import { CompanyUserOrmEntity } from '@src/common/infrastructure/database/typeorm/company-user.orm';
import { Not } from 'typeorm';
import { DepartmentOrmEntity } from '@src/common/infrastructure/database/typeorm/department.orm';

@CommandHandler(UpdateCommand)
export class UpdateCommandHandler
  implements
    IQueryHandler<UpdateCommand, ResponseResult<BudgetApprovalRuleEntity>>
{
  constructor(
    @Inject(WRITE_BUDGET_APPROVAL_RULE_REPOSITORY)
    private readonly _write: IWriteBudgetApprovalRuleRepository,
    private readonly _dataMapper: BudgetApprovalRuleDataMapper,
    private readonly _userContextService: UserContextService,
  ) {}

  async execute(
    query: UpdateCommand,
  ): Promise<ResponseResult<BudgetApprovalRuleEntity>> {
    const { min_amount, max_amount } = query.dto;
    let departmentId: number | null | undefined = null;

    const user = this._userContextService.getAuthUser()?.user;
    const user_id = user?.id;

    let company_id: number | null | undefined = null;
    const company = await query.manager.findOne(CompanyUserOrmEntity, {
      where: {
        user_id: user_id,
      },
    });

    const departmentUser = await query.manager.findOne(
      DepartmentUserOrmEntity,
      {
        where: { user_id: user_id },
      },
    );
    const department_id = departmentUser?.department_id ?? null;

    await findOneOrFail(query.manager, DepartmentOrmEntity, {
      id: query.dto.department_id,
    });

    if (department_id && department_id !== null) {
      departmentId = department_id;
    } else {
      departmentId = query.dto.department_id;
    }

    company_id = company?.company_id ?? null;

    if (company_id) {
      const check_budget_approval_rule = await query.manager.findOne(
        BudgetApprovalRuleOrmEntity,
        {
          where: {
            id: Not(query.id),
            approver_id: query.dto.approver_id,
            company_id: company_id,
          },
        },
      );

      if (check_budget_approval_rule) {
        throw new ManageDomainException(
          'errors.already_exists',
          HttpStatus.BAD_REQUEST,
          { property: `approver id ${query.dto.approver_id}` },
        );
      }
    } else {
      await _checkColumnDuplicate(
        BudgetApprovalRuleOrmEntity,
        'approver_id',
        query.dto.approver_id,
        query.manager,
        'errors.already_exists',
        query.id,
      );
    }

    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
        { property: `${query.id}` },
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

    await findOneOrFail(query.manager, DepartmentUserOrmEntity, {
      user_id: query.dto.approver_id,
    });

    const entity = this._dataMapper.toEntity(
      query.dto,
      departmentId || undefined,
      company_id || undefined,
    );
    await entity.initializeUpdateSetId(new BudgetApprovalRuleId(query.id));
    await entity.validateExistingIdForUpdate();

    /** Check Exits Department Id */
    await findOneOrFail(query.manager, BudgetApprovalRuleOrmEntity, {
      id: entity.getId().value,
    });

    return await this._write.update(entity, query.manager);
  }
}
