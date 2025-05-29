import { CategoryOrmEntity } from '@src/common/infrastructure/database/typeorm/category.orm';
import { CategoryEntity } from '../../domain/entities/category.entity';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { CategoryId } from '../../domain/value-objects/category-id.vo';
import moment from 'moment-timezone';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';

export class CategoryDataAccessMapper {
  toOrmEntity(
    categoryEntity: CategoryEntity,
    method: OrmEntityMethod,
  ): CategoryOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);
    const id = categoryEntity.getId();

    const mediaOrmEntity = new CategoryOrmEntity();
    if (id) {
      mediaOrmEntity.id = id.value;
    }
    mediaOrmEntity.name = categoryEntity.name;
    if (method === OrmEntityMethod.CREATE) {
      mediaOrmEntity.created_at = categoryEntity.createdAt ?? new Date(now);
    }
    // mediaOrmEntity.created_at = categoryEntity.createdAt ?? new Date(now);
    mediaOrmEntity.updated_at = new Date(now);

    return mediaOrmEntity;
  }

  toEntity(ormData: CategoryOrmEntity): CategoryEntity {
    return CategoryEntity.builder()
      .setCategoryId(new CategoryId(ormData.id))
      .setName(ormData.name ?? '')
      .setCreatedAt(ormData.created_at)
      .setUpdatedAt(ormData.updated_at)
      .build();
  }
}
