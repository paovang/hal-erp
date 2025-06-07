import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { BudgetItemDetailEntity } from '../../domain/entities/budget-item-detail.entity';
import { BudgetItemDetailOrmEntity } from '@src/common/infrastructure/database/typeorm/budget-item-detail.orm';
import { BudgetItemDetailId } from '../../domain/value-objects/budget-item-detail-rule-id.vo';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';

export class BudgetItemDetailDataAccessMapper {
  toOrmEntity(
    budgetItemDetailEntity: BudgetItemDetailEntity,
    method: OrmEntityMethod,
  ): BudgetItemDetailOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);
    const id = budgetItemDetailEntity.getId();

    const mediaOrmEntity = new BudgetItemDetailOrmEntity();
    if (id) {
      mediaOrmEntity.id = id.value;
    }
    mediaOrmEntity.budget_item_id = budgetItemDetailEntity.budgetItemId;
    mediaOrmEntity.name = budgetItemDetailEntity.name;
    mediaOrmEntity.province_id = budgetItemDetailEntity.provinceId;
    mediaOrmEntity.description = budgetItemDetailEntity.description;
    mediaOrmEntity.allocated_amount = budgetItemDetailEntity.allocatedAmount;
    if (method === OrmEntityMethod.CREATE) {
      mediaOrmEntity.created_at =
        budgetItemDetailEntity.createdAt ?? new Date(now);
    }
    mediaOrmEntity.updated_at = new Date(now);

    return mediaOrmEntity;
  }

  toEntity(ormData: BudgetItemDetailOrmEntity): BudgetItemDetailEntity {
    return BudgetItemDetailEntity.builder()
      .setBudgetItemDetailId(new BudgetItemDetailId(ormData.id))
      .setName(ormData.name ?? '')
      .setBudgetItemId(ormData.budget_item_id ?? 0)
      .setProvinceId(ormData.province_id ?? 0)
      .setDescription(ormData.description ?? '')
      .setAllocatedAmount(ormData.allocated_amount ?? 0)
      .setCreatedAt(ormData.created_at)
      .setUpdatedAt(ormData.updated_at)
      .build();
  }
}
