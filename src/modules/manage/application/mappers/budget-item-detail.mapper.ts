import { Injectable } from '@nestjs/common';
import { CreateBudgetItemDetailDto } from '../dto/create/budgetItemDetail/create.dto';
import { BudgetItemDetailEntity } from '../../domain/entities/budget-item-detail.entity';
import { BudgetItemDetailResponse } from '../dto/response/budget-item-detail.response';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { ProvinceDataMapper } from './province.mapper';

@Injectable()
export class BudgetItemDetailDataMapper {
  constructor(private readonly province: ProvinceDataMapper) {}

  /** Mapper Dto To Entity */
  toEntity(
    dto: CreateBudgetItemDetailDto,
    budget_item_id?: number,
  ): BudgetItemDetailEntity {
    const builder = BudgetItemDetailEntity.builder();

    if (dto.name) {
      builder.setName(dto.name);
    }

    if (budget_item_id) {
      builder.setBudgetItemId(budget_item_id);
    }

    if (dto.provinceId) {
      builder.setProvinceId(dto.provinceId);
    }

    if (dto.description) {
      builder.setDescription(dto.description);
    }

    if (dto.allocated_amount) {
      builder.setAllocatedAmount(dto.allocated_amount);
    }

    return builder.build();
  }

  /** Mapper Entity To Response */
  toResponse(entity: BudgetItemDetailEntity): BudgetItemDetailResponse {
    const response = new BudgetItemDetailResponse();
    response.id = entity.getId().value;
    response.name = entity.name;
    response.budget_item_id = entity.budgetItemId;
    response.province_id = entity.provinceId;
    response.description = entity.description;
    response.allocated_amount = entity.allocatedAmount;
    response.created_at = moment
      .tz(entity.createdAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.updated_at = moment
      .tz(entity.updatedAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);

    response.province = entity.province
      ? this.province.toResponse(entity.province)
      : null;

    return response;
  }
}
