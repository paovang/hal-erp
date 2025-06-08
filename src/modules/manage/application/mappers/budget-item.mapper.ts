import { Injectable } from '@nestjs/common';
import { BudgetItemResponse } from '../dto/response/budget-item.response';
import { BudgetItemEntity } from '../../domain/entities/budget-item.entity';
import { CreateBudgetItemDto } from '../dto/create/BudgetItem/create.dto';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { BudgetItemDetailDataMapper } from './budget-item-detail.mapper';
import { UpdateBudgetItemDto } from '../dto/create/BudgetItem/update.dto';

@Injectable()
export class BudgetItemDataMapper {
  constructor(private readonly details: BudgetItemDetailDataMapper) {}
  /** Mapper Dto To Entity */
  toEntity(dto: CreateBudgetItemDto | UpdateBudgetItemDto): BudgetItemEntity {
    const builder = BudgetItemEntity.builder();

    if (dto.name) {
      builder.setName(dto.name);
    }

    if ('budget_accountId' in dto) {
      builder.setBudgetAccountId(dto.budget_accountId);
    }

    return builder.build();
  }

  /** Mapper Entity To Response */
  toResponse(entity: BudgetItemEntity): BudgetItemResponse {
    const response = new BudgetItemResponse();
    response.id = entity.getId().value;
    response.name = entity.name;
    response.budget_account_id = entity.budgetAccountId;
    response.allocated_amount = entity.allocatedAmount;
    response.created_at = moment
      .tz(entity.createdAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.updated_at = moment
      .tz(entity.updatedAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);

    response.count_details = entity.count_details;

    response.budget_item_details = entity.details
      ? entity.details.map((detail) => this.details.toResponse(detail))
      : null;

    return response;
  }
}
