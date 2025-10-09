import { PurchaseRequestItemOrmEntity } from '@src/common/infrastructure/database/typeorm/purchase-request-item.orm';
import { Injectable } from '@nestjs/common';
import { ReportPurchaseRequestItemEntity } from '../../domain/entities/report-purchase-request-item.entity';
import { ReportPurchaseRequestItemId } from '../../domain/value-objects/report-purchase-request-item-id.vo';
import { UnitDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/unit.mapper';

@Injectable()
export class ReportPurchaseRequestItemDataAccessMapper {
  constructor(private readonly unitMapper: UnitDataAccessMapper) {}

  toEntity(
    ormData: PurchaseRequestItemOrmEntity,
  ): ReportPurchaseRequestItemEntity {
    const builder = ReportPurchaseRequestItemEntity.builder()
      .setPurchaseRequestItemId(new ReportPurchaseRequestItemId(ormData.id))
      .setPurchaseRequestId(ormData.purchase_request_id ?? 0)
      .setTitle(ormData.title ?? '')
      .setFileName(ormData.file_name ?? '')
      .setQuantity(Number(ormData.quantity ?? 0))
      .setUnitId(ormData.unit_id ?? 0)
      .setPrice(Number(ormData.price ?? 0))
      .setTotalPrice(Number(ormData.total_price ?? 0))
      .setRemark(ormData.remark ?? '')
      .setCreatedAt(ormData.created_at);

    if (ormData.units) {
      builder.setUnit(this.unitMapper.toEntity(ormData.units));
    }

    return builder.build();
  }
}
