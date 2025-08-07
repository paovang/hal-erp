import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { IncreaseBudgetDetailEntity } from '../../domain/entities/increase-budget-detail.entity';
import { IncreaseBudgetDetailOrmEntity } from '@src/common/infrastructure/database/typeorm/increase-budget-detail.orm';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { IncreaseBudgetDetailId } from '../../domain/value-objects/increase-budget-detail-id.vo';

export class IncreaseBudgetDetailDataAccessMapper {
  toOrmEntity(
    entity: IncreaseBudgetDetailEntity,
    method: OrmEntityMethod,
  ): IncreaseBudgetDetailOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);
    const id = entity.getId();

    const mediaOrmEntity = new IncreaseBudgetDetailOrmEntity();
    if (id) {
      mediaOrmEntity.id = id.value;
    }

    mediaOrmEntity.budget_item_id = entity.budget_item_id;
    mediaOrmEntity.allocated_amount = entity.allocated_amount;
    if (method === OrmEntityMethod.CREATE) {
      mediaOrmEntity.created_at = entity.createdAt ?? new Date(now);
    }
    mediaOrmEntity.updated_at = new Date(now);

    return mediaOrmEntity;
  }

  toEntity(ormData: IncreaseBudgetDetailOrmEntity): IncreaseBudgetDetailEntity {
    return IncreaseBudgetDetailEntity.builder()
      .setIncreaseBudgetDetailId(new IncreaseBudgetDetailId(ormData.id))
      .setBudgetItemId(ormData.budget_item_id ?? 0)
      .setAllocatedAmount(ormData.allocated_amount ?? 0)
      .setCreatedAt(ormData.created_at)
      .setUpdatedAt(ormData.updated_at)
      .build();
  }
}
