import { Injectable } from '@nestjs/common';
import { BudgetAccountResponse } from '../dto/response/budget-account.response';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { BudgetAccountEntity } from '../../domain/entities/budget-account.entity';
import { DepartmentDataMapper } from './department.mapper';
import { CreateBudgetAccountDto } from '../dto/create/BudgetAccount/create.dto';
import { UpdateBudgetAccountDto } from '../dto/create/BudgetAccount/update.dto';
import { CompanyDataMapper } from './company.mapper';

@Injectable()
export class BudgetAccountDataMapper {
  constructor(
    private readonly departmentDataMapper: DepartmentDataMapper,
    private readonly company: CompanyDataMapper,
  ) {}
  /** Mapper Dto To Entity */
  toEntity(
    dto: CreateBudgetAccountDto | UpdateBudgetAccountDto,
    code?: string,
    company_id?: number,
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

    if (dto.type) {
      builder.setType(dto.type);
    }

    if (company_id) {
      builder.setCompanyId(company_id);
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
    response.company_id = entity.company_id;
    response.fiscal_year = entity.fiscal_year;
    response.allocated_amount = entity.allocated_amount;
    response.total_budget = entity.total_budget;
    response.increase_amount = entity.increase_amount;
    response.used_amount = entity.used_amount;
    response.balance_amount = entity.balance_amount;
    response.type = entity.type;
    response.created_at = moment
      .tz(entity.createdAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.updated_at = moment
      .tz(entity.updatedAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);

    response.department = entity.department
      ? this.departmentDataMapper.toResponse(entity.department)
      : null;

    response.company = entity.company
      ? this.company.toResponse(entity.company)
      : null;

    return response;
  }
}
