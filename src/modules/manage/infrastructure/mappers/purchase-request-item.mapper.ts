import { PurchaseRequestItemOrmEntity } from '@src/common/infrastructure/database/typeorm/purchase-request-item.orm';
import { PurchaseRequestItemEntity } from '../../domain/entities/purchase-request-item.entity';
import { PurchaseRequestItemId } from '../../domain/value-objects/purchase-request-item-id.vo';
import { Injectable } from '@nestjs/common';
import { UnitDataAccessMapper } from './unit.mapper';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';

@Injectable()
export class PurchaseRequestItemDataAccessMapper {
  constructor(private readonly unitMapper: UnitDataAccessMapper) {}

  toOrmEntity(
    prItemEntity: PurchaseRequestItemEntity,
    method: OrmEntityMethod,
  ): PurchaseRequestItemOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);
    // const id = prItemEntity.getId();

    const mediaOrmEntity = new PurchaseRequestItemOrmEntity();
    // if (id) {
    //   mediaOrmEntity.id = id.value;
    // }

    if (prItemEntity.getId() && method !== OrmEntityMethod.CREATE) {
      mediaOrmEntity.id = prItemEntity.getId().value;
    }

    mediaOrmEntity.purchase_request_id = prItemEntity.purchase_request_id;
    mediaOrmEntity.title = prItemEntity.title;
    mediaOrmEntity.file_name = prItemEntity.file_name;
    mediaOrmEntity.quantity = prItemEntity.quantity;
    mediaOrmEntity.unit_id = prItemEntity.unit_id;
    mediaOrmEntity.price = prItemEntity.price;
    mediaOrmEntity.total_price = prItemEntity.total_price;
    mediaOrmEntity.remark = prItemEntity.remark;
    if (method === OrmEntityMethod.CREATE) {
      mediaOrmEntity.created_at = prItemEntity.createdAt ?? new Date(now);
    }
    mediaOrmEntity.updated_at = new Date(now);

    return mediaOrmEntity;
  }

  toEntity(ormData: PurchaseRequestItemOrmEntity): PurchaseRequestItemEntity {
    const builder = PurchaseRequestItemEntity.builder()
      .setPurchaseRequestItemId(new PurchaseRequestItemId(ormData.id))
      .setPurchaseRequestId(ormData.purchase_request_id ?? 0)
      .setTitle(ormData.title ?? '')
      .setFileName(ormData.file_name ?? '')
      .setQuantity(ormData.quantity ?? 0)
      .setUnitId(ormData.unit_id ?? 0)
      .setPrice(ormData.price ?? 0)
      .setTotalPrice(ormData.total_price ?? 0)
      .setRemark(ormData.remark ?? '')
      .setCreatedAt(ormData.created_at);

    if (ormData.units) {
      builder.setUnit(this.unitMapper.toEntity(ormData.units));
    }

    return builder.build();
  }
}
