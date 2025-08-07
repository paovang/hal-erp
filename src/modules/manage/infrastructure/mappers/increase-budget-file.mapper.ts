import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { IncreaseBudgetFileEntity } from '../../domain/entities/increase-budget-file.entity';
import { IncreaseBudgetFileOrmEntity } from '@src/common/infrastructure/database/typeorm/increase-budget-file.orm';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import moment from 'moment-timezone';
import { IncreaseBudgetFileId } from '../../domain/value-objects/increase-budget-file-id.vo';

export class IncreaseBudgetFileDataAccessMapper {
  toOrmEntity(
    entity: IncreaseBudgetFileEntity,
    method: OrmEntityMethod,
  ): IncreaseBudgetFileOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);
    const id = entity.getId();

    const mediaOrmEntity = new IncreaseBudgetFileOrmEntity();
    if (id) {
      mediaOrmEntity.id = id.value;
    }

    mediaOrmEntity.increase_budget_id = entity.increase_budget_id;
    mediaOrmEntity.file_name = entity.file_name;
    if (method === OrmEntityMethod.CREATE) {
      mediaOrmEntity.created_at = entity.createdAt ?? new Date(now);
    }
    mediaOrmEntity.updated_at = new Date(now);

    return mediaOrmEntity;
  }

  toEntity(ormData: IncreaseBudgetFileOrmEntity): IncreaseBudgetFileEntity {
    return IncreaseBudgetFileEntity.builder()
      .setIncreaseBudgetFileId(new IncreaseBudgetFileId(ormData.id))
      .setIncreaseBudgetId(ormData.increase_budget_id ?? 0)
      .setFileName(ormData.file_name ?? '')
      .setCreatedAt(ormData.created_at)
      .setUpdatedAt(ormData.updated_at)
      .build();
  }
}
