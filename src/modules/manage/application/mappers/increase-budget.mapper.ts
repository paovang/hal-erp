import { Injectable } from '@nestjs/common';
import { IncreaseBudgetEntity } from '../../domain/entities/increase-budget.entity';
import { IncreaseBudgetResponse } from '../dto/response/increase-budget.response';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';

Injectable();
export class IncreaseBudgetDataMapper {
  /** Mapper Dto To Entity */
  toEntity(dto: any): IncreaseBudgetEntity {
    const builder = IncreaseBudgetEntity.builder();

    if (dto.budget_account_id) {
      builder.setBudgetAccountId(dto.budget_account_id);
    }

    if (dto.allocated_amount) {
      builder.setAllocatedAmount(dto.allocated_amount);
    }

    if (dto.description) {
      builder.setDescription(dto.description);
    }

    if (dto.import_date) {
      builder.setImportDate(dto.import_date);
    }

    if (dto.created_by) {
      builder.setCreatedBy(dto.created_by);
    }
    return builder.build();
  }

  /** Mapper Entity To Response */
  toResponse(entity: IncreaseBudgetEntity): IncreaseBudgetResponse {
    const response = new IncreaseBudgetResponse();
    response.id = entity.getId().value;
    response.budget_account_id = entity.budget_account_id;
    response.allocated_amount = entity.allocated_amount;
    response.description = entity.description;
    response.import_date = moment
      .tz(entity.import_date, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.created_by = entity.created_by;
    response.created_at = moment
      .tz(entity.createdAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.updated_at = moment
      .tz(entity.updatedAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);

    return response;
  }
}
