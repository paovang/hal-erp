import { Injectable } from '@nestjs/common';
import { IncreaseBudgetDetailEntity } from '../../domain/entities/increase-budget-detail.entity';
import { IncreaseBudgetDetailResponse } from '../dto/response/increase-budget-detail.response';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { CreateIncreaseBudgetDetailDto } from '../dto/create/increaseBudgetDetail/create.dto';
import { BudgetItemDataMapper } from './budget-item.mapper';

@Injectable()
export class IncreaseBudgetDetailDataMapper {
  constructor(private readonly _budget_item: BudgetItemDataMapper) {}
  /** Mapper Dto To Entity */
  toEntity(
    dto: CreateIncreaseBudgetDetailDto,
    increase_budget_id: number,
  ): IncreaseBudgetDetailEntity {
    const builder = IncreaseBudgetDetailEntity.builder();

    if (dto.budget_item_id) {
      builder.setBudgetItemId(dto.budget_item_id);
    }

    if (dto.allocated_amount) {
      builder.setAllocatedAmount(dto.allocated_amount);
    }

    if (increase_budget_id) {
      builder.setIncreaseBudgetId(increase_budget_id);
    }

    return builder.build();
  }

  /** Mapper Entity To Response */
  toResponse(entity: IncreaseBudgetDetailEntity): IncreaseBudgetDetailResponse {
    const response = new IncreaseBudgetDetailResponse();
    response.id = Number(entity.getId().value);
    response.budget_item_id = entity.budget_item_id;
    response.increase_budget_id = entity.increase_budget_id;
    response.allocated_amount = entity.allocated_amount;
    response.created_at = moment
      .tz(entity.createdAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.updated_at = moment
      .tz(entity.updatedAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);

    response.budget_item = entity.budget_item
      ? this._budget_item.toResponse(entity.budget_item)
      : null;

    return response;
  }
}
