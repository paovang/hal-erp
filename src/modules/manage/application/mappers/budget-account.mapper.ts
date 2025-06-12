import { Injectable } from '@nestjs/common';
import { CreateBudgetAccountDto } from '../dto/create/budgetAccount/create.dto';
import { BudgetAccountResponse } from '../dto/response/budget-account.response';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { BudgetAccountEntity } from '../../domain/entities/budget-account.entity';
import { DepartmentDataMapper } from './department.mapper';
import { UpdateBudgetAccountDto } from '../dto/create/budgetAccount/update.dto';

@Injectable()
export class BudgetAccountDataMapper {
  constructor(private readonly departmentDataMapper: DepartmentDataMapper) {}
  /** Mapper Dto To Entity */
  toEntity(
    dto: CreateBudgetAccountDto | UpdateBudgetAccountDto,
    code?: string,
  ): BudgetAccountEntity {
    const builder = BudgetAccountEntity.builder();
    if (code) {
      builder.setCode(code);
    }

    if (dto.name) {
      builder.setName(dto.name);
    }

    if (dto.fiscal_year) {
      builder.setFiscalYear(dto.fiscal_year);
    }

    if (dto.allocated_amount) {
      builder.setAllocatedAmount(dto.allocated_amount);
    }

    if (dto.departmentId) {
      builder.setDepartmentId(dto.departmentId);
    }

    return builder.build();
  }

  /** Mapper Entity To Response */
  toResponse(entity: BudgetAccountEntity): BudgetAccountResponse {
    const response = new BudgetAccountResponse();
    response.id = entity.getId().value;
    response.code = entity.code;
    response.name = entity.name;
    response.department_id = Number(entity.departmentId);
    response.fiscal_year = entity.fiscal_year;
    response.allocated_amount = entity.allocated_amount;
    response.created_at = moment
      .tz(entity.createdAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.updated_at = moment
      .tz(entity.updatedAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);

    response.department = entity.department
      ? this.departmentDataMapper.toResponse(entity.department)
      : null;

    return response;
  }
}
