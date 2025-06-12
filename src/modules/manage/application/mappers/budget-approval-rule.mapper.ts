import { Injectable } from '@nestjs/common';
import { BudgetApprovalRuleEntity } from '../../domain/entities/budget-approval-rule.entity';
import { BudgetApprovalRuleResponse } from '../dto/response/budget-approval-rule.response';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { CreateBudgetApprovalRuleDto } from '../dto/create/budgetApprovalRule/create.dto';
import { DepartmentDataMapper } from './department.mapper';
import { UserDataMapper } from './user.mapper';
import { UpdateBudgetApprovalRuleDto } from '../dto/create/budgetApprovalRule/update.dto';

@Injectable()
export class BudgetApprovalRuleDataMapper {
  constructor(
    private readonly departmentDataMapper: DepartmentDataMapper,
    private readonly userDataMapper: UserDataMapper,
  ) {}
  /** Mapper Dto To Entity */
  toEntity(
    dto: CreateBudgetApprovalRuleDto | UpdateBudgetApprovalRuleDto,
    departmentId?: number,
  ): BudgetApprovalRuleEntity {
    const builder = BudgetApprovalRuleEntity.builder();

    if (departmentId) {
      builder.setDepartmentId(departmentId);
    }

    if (dto.approver_id) {
      builder.setApproverId(dto.approver_id);
    }

    if (dto.min_amount) {
      builder.setMinAmount(dto.min_amount);
    }

    if (dto.max_amount) {
      builder.setMaxAmount(dto.max_amount);
    }

    return builder.build();
  }

  /** Mapper Entity To Response */
  toResponse(entity: BudgetApprovalRuleEntity): BudgetApprovalRuleResponse {
    const response = new BudgetApprovalRuleResponse();
    response.id = entity.getId().value;
    response.department_id = Number(entity.departmentID);
    response.approver_id = entity.approverID;
    response.min_amount = entity.minAmount;
    response.max_amount = entity.maxAmount;
    response.created_at = moment
      .tz(entity.createdAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.updated_at = moment
      .tz(entity.updatedAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);

    response.department = entity.department
      ? this.departmentDataMapper.toResponse(entity.department)
      : null;

    response.approver = entity.user
      ? this.userDataMapper.toResponse(entity.user)
      : null;

    return response;
  }
}
