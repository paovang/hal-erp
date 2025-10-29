import { ProductOrmEntity } from '@src/common/infrastructure/database/typeorm/product.orm';
import { ProductEntity } from '@src/modules/manage/domain/entities/product.entity';
import { ProductId } from '../../domain/value-objects/product-id.vo';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import moment from 'moment-timezone';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductDataAccessMapper {
  toOrmEntity(
    productEntity: ProductEntity,
    method: OrmEntityMethod,
  ): ProductOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);
    const id = productEntity.getId();

    const ormEntity = new ProductOrmEntity();
    if (id) {
      ormEntity.id = id.value;
    }
    ormEntity.name = productEntity.name;
    ormEntity.description = productEntity.description;
    ormEntity.product_type_id = productEntity.productTypeId;
    ormEntity.status = productEntity.status;

    if (method === OrmEntityMethod.CREATE) {
      ormEntity.created_at = productEntity.createdAt ?? new Date(now);
    }
    ormEntity.updated_at = new Date(now);

    return ormEntity;
  }

  toEntity(ormData: ProductOrmEntity): ProductEntity {
    const builder = ProductEntity.builder()
      .setProductId(new ProductId(ormData.id))
      .setName(ormData.name || '')
      .setDescription(ormData.description || '')
      .setProductTypeId(ormData.product_type_id || 0)
      .setStatus(ormData.status || 'active')
      .setCreatedAt(ormData.created_at)
      .setUpdatedAt(ormData.updated_at);

    // Add product type if relation is loaded
    if (ormData.product_type) {
      builder.setProductType({
        id: ormData.product_type.id,
        name: ormData.product_type.name || '',
      });
    }

    return builder.build();
  }
}