import { VendorProductOrmEntity } from '@src/common/infrastructure/database/typeorm/vendor-product.orm';
import { VendorProductEntity } from '../../domain/entities/vendor-product.entity';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import moment from 'moment-timezone';
import { VendorProductId } from '../../domain/value-objects/vendor-product-id.vo';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { CurrencyDataAccessMapper } from './currency.mapper';

export class VendorProductDataAccessMapper {
  constructor() {} // private readonly currencyDataAccessMapper: CurrencyDataAccessMapper,
  toOrmEntity(
    vendorProductEntity: VendorProductEntity,
    method: OrmEntityMethod,
  ): VendorProductOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);
    const id = vendorProductEntity.getId();

    const vendorProductOrmEntity = new VendorProductOrmEntity();
    if (id) {
      vendorProductOrmEntity.id = id.value;
    }

    vendorProductOrmEntity.vendor_id = vendorProductEntity.vendorId;
    vendorProductOrmEntity.product_id = vendorProductEntity.productId;
    vendorProductOrmEntity.price = vendorProductEntity.price;
    vendorProductOrmEntity.currency_id = vendorProductEntity.currencyId;

    if (method === OrmEntityMethod.CREATE) {
      vendorProductOrmEntity.created_at =
        vendorProductEntity.createdAt ?? new Date(now);
    }

    vendorProductOrmEntity.updated_at = new Date(now);

    return vendorProductOrmEntity;
  }

  toEntity(ormData: VendorProductOrmEntity): VendorProductEntity {
    const builder = VendorProductEntity.builder()
      .setVendorProductId(new VendorProductId(ormData.id))
      .setVendorId(ormData.vendor_id!)
      .setProductId(ormData.product_id!)
      .setPrice(ormData.price)
      .setCreatedAt(ormData.created_at)
      .setUpdatedAt(ormData.updated_at)
      .setDeletedAt(ormData.deleted_at);
    if (ormData.currency_id) builder.setCurrencyId(ormData.currency_id);

    // Set vendor and product if they exist
    if (ormData.vendors && ormData.vendors.name) {
      builder.setVendor({
        id: ormData.vendors.id,
        name: ormData.vendors.name,
      });
    }

    if (ormData.products && ormData.products.name) {
      builder.setProduct({
        id: ormData.products.id,
        name: ormData.products.name,
      });
    }

    if (ormData.currency) {
      builder.setCurrency(
        new CurrencyDataAccessMapper().toEntity(ormData.currency),
      );
    }
    return builder.build();
  }
}
