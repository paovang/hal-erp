import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { IncreaseBudgetEntity } from '../../domain/entities/increase-budget.entity';
import { IncreaseBudgetOrmEntity } from '@src/common/infrastructure/database/typeorm/increase-budget.orm';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import moment from 'moment-timezone';
import { IncreaseBudgetId } from '../../domain/value-objects/increase-budget-id.vo';

export class IncreaseBudgetDataAccessMapper {
  toOrmEntity(
    entity: IncreaseBudgetEntity,
    method: OrmEntityMethod,
  ): IncreaseBudgetOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);
    const id = entity.getId();

    const mediaOrmEntity = new IncreaseBudgetOrmEntity();
    if (id) {
      mediaOrmEntity.id = id.value;
    }

    mediaOrmEntity.budget_account_id = entity.budget_account_id;
    mediaOrmEntity.allocated_amount = entity.allocated_amount;
    mediaOrmEntity.description = entity.description ?? '';
    mediaOrmEntity.import_date = entity.import_date ?? new Date(now);
    mediaOrmEntity.created_by = entity.created_by;
    if (method === OrmEntityMethod.CREATE) {
      mediaOrmEntity.created_at = entity.createdAt ?? new Date(now);
    }
    mediaOrmEntity.updated_at = new Date(now);

    return mediaOrmEntity;
  }

  toEntity(ormData: IncreaseBudgetOrmEntity): IncreaseBudgetEntity {
    return IncreaseBudgetEntity.builder()
      .setIncreaseBudgetId(new IncreaseBudgetId(ormData.id))
      .setBudgetAccountId(ormData.budget_account_id ?? 0)
      .setAllocatedAmount(ormData.allocated_amount ?? 0)
      .setDescription(ormData.description ?? '')
      .setImportDate(ormData.import_date ?? null)
      .setCreatedBy(ormData.created_by ?? 0)
      .setCreatedAt(ormData.created_at)
      .setUpdatedAt(ormData.updated_at)
      .build();
  }
}
