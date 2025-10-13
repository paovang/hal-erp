import { Injectable } from '@nestjs/common';
import { PurchaseOrderOrmEntity } from '@src/common/infrastructure/database/typeorm/purchase-order.orm';
import { ReportPurchaseOrderEntity } from '../../domain/entities/report-purchase-order.entity';
import { ReportPurchaseOrderId } from '../../domain/value-objects/report-purchase-order-id.vo';
import { PurchaseOrderItemDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/purchase-order-item.mapper';
import { DocumentDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/document.mapper';
import { UserApprovalDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/user-approval.mapper';

@Injectable()
export class ReportPurchaseOrderDataAccessMapper {
  constructor(
    private readonly purchaseOrderItemMapper: PurchaseOrderItemDataAccessMapper,
    private readonly documentMapper: DocumentDataAccessMapper,
    private readonly userApprovalMapper: UserApprovalDataAccessMapper,
  ) {}

  toEntity(
    ormData: PurchaseOrderOrmEntity,
    step: number = 0,
  ): ReportPurchaseOrderEntity {
    const items = ormData.purchase_order_items || [];

    interface PurchaseRequestItemLike {
      total_price?: number;
      sub_total?: number;
      vat?: number;
      [key: string]: any;
    }

    const sub_total: number = items.reduce(
      (sum: number, item: PurchaseRequestItemLike) =>
        sum + Number(item.total || 0),
      0,
    );

    const vat: number = items.reduce(
      (sum: number, item: PurchaseRequestItemLike) =>
        sum + Number(item.vat || 0),
      0,
    );

    const total = sub_total + vat;
    const count = items.length;

    const builder = ReportPurchaseOrderEntity.builder()
      .setPurchaseOrderId(new ReportPurchaseOrderId(ormData.id))
      .setDocumentId(ormData.document_id ?? 0)
      .setPurchaseRequestId(ormData.purchase_request_id ?? 0)
      .setPoNumber(ormData.po_number)
      .setPurposes(ormData.purposes ?? '')
      .setOrderDate(ormData.order_date ?? new Date())
      .setExpiredDate(ormData.expired_date ?? new Date())
      .setSubTotal(sub_total)
      .setVat(vat)
      .setTotal(total)
      .setCreatedAt(ormData.created_at)
      .setUpdatedAt(ormData.updated_at)
      .setDeletedAt(ormData.deleted_at)
      .setCountItem(count)
      .setStep(step);

    if (ormData.documents) {
      builder.setDocument(this.documentMapper.toEntity(ormData.documents));
    }

    if (ormData.purchase_order_items) {
      builder.setOrderItem(
        ormData.purchase_order_items.map((item) =>
          this.purchaseOrderItemMapper.toEntity(item),
        ),
      );
    }

    if (ormData.documents && ormData.documents.user_approvals) {
      builder.setUserApproval(
        this.userApprovalMapper.toEntity(ormData.documents.user_approvals),
      );
    }

    return builder.build();
  }
}
