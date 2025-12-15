import { ProductTypeOrmEntity } from '@src/common/infrastructure/database/typeorm/product-type.orm';
import { ProductTypeEntity } from '@src/modules/manage/domain/entities/product-type.entity';
import { ProductTypeId } from '../../domain/value-objects/product-type-id.vo';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import moment from 'moment-timezone';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductTypeDataAccessMapper {
  toOrmEntity(
    productTypeEntity: ProductTypeEntity,
    method: OrmEntityMethod,
  ): ProductTypeOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);
    const id = productTypeEntity.getId();

    const ormEntity = new ProductTypeOrmEntity();
    if (id) {
      ormEntity.id = id.value;
    }
    ormEntity.name = productTypeEntity.name;
    ormEntity.category_id = productTypeEntity.categoryId;

    if (method === OrmEntityMethod.CREATE) {
      ormEntity.created_at = productTypeEntity.createdAt ?? new Date(now);
    }
    ormEntity.updated_at = new Date(now);

    return ormEntity;
  }

  toEntity(ormData: ProductTypeOrmEntity): ProductTypeEntity {
    const builder = ProductTypeEntity.builder()
      .setProductTypeId(new ProductTypeId(ormData.id))
      .setName(ormData.name || '')
      .setCategoryId(ormData.category_id || 0)
      .setCreatedAt(ormData.created_at)
      .setUpdatedAt(ormData.updated_at);

    // Add category if relation is loaded
    if (ormData.category) {
      builder.setCategory({
        id: ormData.category.id,
        name: ormData.category.name || '',
      });
    }

    return builder.build();
  }
}
