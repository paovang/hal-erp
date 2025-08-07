import { Injectable } from '@nestjs/common';
import { IncreaseBudgetDetailEntity } from '../../domain/entities/increase-budget-detail.entity';
import { IncreaseBudgetDetailResponse } from '../dto/response/increase-budget-detail.response';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';

@Injectable()
export class IncreaseBudgetDetailDataMapper {
  /** Mapper Dto To Entity */
  toEntity(dto: any): IncreaseBudgetDetailEntity {
    const builder = IncreaseBudgetDetailEntity.builder();

    if (dto.budget_item_id) {
      builder.setBudgetItemId(dto.budget_item_id);
    }

    if (dto.allocated_amount) {
      builder.setAllocatedAmount(dto.allocated_amount);
    }

    return builder.build();
  }

  /** Mapper Entity To Response */
  toResponse(entity: IncreaseBudgetDetailEntity): IncreaseBudgetDetailResponse {
    const response = new IncreaseBudgetDetailResponse();
    response.id = entity.getId().value;
    response.budget_item_id = entity.budget_item_id;
    response.allocated_amount = entity.allocated_amount;
    response.created_at = moment
      .tz(entity.createdAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.updated_at = moment
      .tz(entity.updatedAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);

    return response;
  }
}
