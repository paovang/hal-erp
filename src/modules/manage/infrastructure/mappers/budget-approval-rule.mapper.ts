import { BudgetApprovalRuleOrmEntity } from '@src/common/infrastructure/database/typeorm/budget-approval-rule.orm';
import { BudgetApprovalRuleEntity } from '../../domain/entities/budget-approval-rule.entity';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { BudgetApprovalRuleId } from '../../domain/value-objects/budget-approval-rule-id.vo';
import { DepartmentDataAccessMapper } from './department.mapper';
import { UserDataAccessMapper } from './user.mapper';
import { Injectable } from '@nestjs/common';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { CompanyDataAccessMapper } from './company.mapper';

@Injectable()
export class BudgetApprovalRuleDataAccessMapper {
  constructor(
    private readonly departmentMapper: DepartmentDataAccessMapper,
    private readonly userMapper: UserDataAccessMapper,
    private readonly company: CompanyDataAccessMapper,
  ) {}
  toOrmEntity(
    budgetApprovalRuleEntity: BudgetApprovalRuleEntity,
    method: OrmEntityMethod,
  ): BudgetApprovalRuleOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);
    const id = budgetApprovalRuleEntity.getId();

    const mediaOrmEntity = new BudgetApprovalRuleOrmEntity();
    if (id) {
      mediaOrmEntity.id = id.value;
    }
    mediaOrmEntity.department_id = budgetApprovalRuleEntity.departmentID;
    mediaOrmEntity.approver_id = budgetApprovalRuleEntity.approverID;
    mediaOrmEntity.company_id = budgetApprovalRuleEntity.company_id;
    mediaOrmEntity.min_amount = budgetApprovalRuleEntity.minAmount;
    mediaOrmEntity.max_amount = budgetApprovalRuleEntity.maxAmount;

    if (method === OrmEntityMethod.CREATE) {
      mediaOrmEntity.created_at =
        budgetApprovalRuleEntity.createdAt ?? new Date(now);
    }

    mediaOrmEntity.updated_at = new Date(now);

    return mediaOrmEntity;
  }

  toEntity(ormData: BudgetApprovalRuleOrmEntity): BudgetApprovalRuleEntity {
    const builder = BudgetApprovalRuleEntity.builder()
      .setBudgetApprovalRuleId(new BudgetApprovalRuleId(ormData.id))
      .setDepartmentId(ormData.department_id ?? 0)
      .setApproverId(ormData.approver_id ?? 0)
      .setCompanyId(ormData.company_id ?? 0)
      .setMinAmount(ormData.min_amount ?? 0)
      .setMaxAmount(ormData.max_amount ?? 0)
      .setCreatedAt(ormData.created_at)
      .setUpdatedAt(ormData.updated_at);

    if (ormData.departments) {
      builder.setDepartment(
        this.departmentMapper.toEntity(ormData.departments),
      );
    }
    if (ormData.users) {
      builder.setUser(this.userMapper.toEntity(ormData.users));
    }

    if (ormData.company) {
      builder.setCompany(this.company.toEntity(ormData.company));
    }

    return builder.build();
  }
}
