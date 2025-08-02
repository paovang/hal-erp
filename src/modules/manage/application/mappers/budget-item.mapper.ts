import { Injectable } from '@nestjs/common';
import { BudgetItemResponse } from '../dto/response/budget-item.response';
import { BudgetItemEntity } from '../../domain/entities/budget-item.entity';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { BudgetItemDetailDataMapper } from './budget-item-detail.mapper';
import { CreateBudgetItemDto } from '../dto/create/BudgetItem/create.dto';
import { UpdateBudgetItemDto } from '../dto/create/BudgetItem/update.dto';
import { BudgetAccountDataMapper } from './budget-account.mapper';

@Injectable()
export class BudgetItemDataMapper {
  constructor(
    private readonly details: BudgetItemDetailDataMapper,
    private readonly budgetAccount: BudgetAccountDataMapper,
  ) {}
  /** Mapper Dto To Entity */
  toEntity(dto: CreateBudgetItemDto | UpdateBudgetItemDto): BudgetItemEntity {
    const builder = BudgetItemEntity.builder();

    if (dto.name) {
      builder.setName(dto.name);
    }

    if ('budget_accountId' in dto) {
      builder.setBudgetAccountId(dto.budget_accountId);
    }

    if (dto.allocated_amount) {
      builder.setAllocatedAmount(dto.allocated_amount);
    }

    if (dto.description) {
      builder.setDescription(dto.description);
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
    response.description = entity.description;
    response.created_at = moment
      .tz(entity.createdAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.updated_at = moment
      .tz(entity.updatedAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);

    response.budget_account = entity.budgetAccount
      ? this.budgetAccount.toResponse(entity.budgetAccount)
      : null;

    return response;
  }
}
