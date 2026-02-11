import { PurchaseOrderOrmEntity } from '@src/common/infrastructure/database/typeorm/purchase-order.orm';
import { PurchaseOrderEntity } from '../../domain/entities/purchase-order.entity';
import { PurchaseOrderId } from '../../domain/value-objects/purchase-order-id.vo';
import { Injectable } from '@nestjs/common';
import { PurchaseOrderItemDataAccessMapper } from './purchase-order-item.mapper';
import { PurchaseOrderSelectedVendorDataAccessMapper } from './purchase-order-selected-vendor.mapper';
import { PurchaseRequestDataAccessMapper } from './purchase-request.mapper';
import { DocumentDataAccessMapper } from './document.mapper';
import { UserApprovalDataAccessMapper } from './user-approval.mapper';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';

@Injectable()
export class PurchaseOrderDataAccessMapper {
  constructor(
    private readonly _orderItem: PurchaseOrderItemDataAccessMapper,
    private readonly _selectedVendor: PurchaseOrderSelectedVendorDataAccessMapper,
    private readonly _purchaseRequest: PurchaseRequestDataAccessMapper,
    private readonly _document: DocumentDataAccessMapper,
    private readonly _userApproval: UserApprovalDataAccessMapper,
  ) {}

  toOrmEntity(
    poEntity: PurchaseOrderEntity,
    method: OrmEntityMethod,
  ): PurchaseOrderOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);
    const id = poEntity.getId();

    const mediaOrmEntity = new PurchaseOrderOrmEntity();
    if (id) {
      mediaOrmEntity.id = id.value;
    }

    mediaOrmEntity.purchase_request_id = poEntity.purchase_request_id;
    mediaOrmEntity.po_number = poEntity.po_number;
    if (method === OrmEntityMethod.CREATE) {
      mediaOrmEntity.order_date = new Date(now);
    }
    mediaOrmEntity.expired_date = poEntity.expired_date ?? new Date(now);
    mediaOrmEntity.purposes = poEntity.purposes;
    mediaOrmEntity.document_id = poEntity.document_id;
    if (method === OrmEntityMethod.CREATE) {
      mediaOrmEntity.created_at = poEntity.createdAt ?? new Date(now);
    }
    mediaOrmEntity.updated_at = new Date(now);

    return mediaOrmEntity;
  }

  toEntity(
    ormData: PurchaseOrderOrmEntity,
    step: number = 0,
  ): PurchaseOrderEntity {
    const items = ormData.purchase_order_items || [];
    interface PurchaseRequestItemLike {
      vat?: number;
      total?: number;
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

    const rc = ormData.receipts;
    const isCreatedRc = rc && rc.length > 0 ? true : false;

    const builder = PurchaseOrderEntity.builder()
      .setPurchaseOrderId(new PurchaseOrderId(ormData.id))
      .setPurchaseRequestId(ormData.purchase_request_id ?? 0)
      .setPoNumber(ormData.po_number ?? '')
      .setOrderDate(ormData.order_date ?? new Date())
      .setExpiredDate(ormData.expired_date ?? new Date())
      .setPurposes(ormData.purposes ?? '')
      .setIsCreatedRc(isCreatedRc)
      .setCreatedAt(ormData.created_at)
      .setUpdatedAt(ormData.updated_at)
      .setSubTotal(sub_total)
      .setVat(vat)
      .setTotal(total)
      .setStep(step);

    if (ormData.purchase_requests) {
      builder.setPurchaseRequest(
        this._purchaseRequest.toEntity(ormData.purchase_requests),
      );
    }

    if (ormData.documents) {
      builder.setDocument(this._document.toEntity(ormData.documents));
    }
    if (ormData.documents && ormData.documents.user_approvals) {
      builder.setUserApproval(
        this._userApproval.toEntity(ormData.documents.user_approvals),
      );
    }

    if (ormData.purchase_order_items) {
      builder.setOrderItem(
        ormData.purchase_order_items.map((item) =>
          this._orderItem.toEntity(item),
        ),
      );
    }

    // if (ormData.purchase_order_selected_vendors) {
    //   builder.setSelectedVendor(
    //     ormData.purchase_order_selected_vendors.map((vendor) =>
    //       this._selectedVendor.toEntity(vendor),
    //     ),
    //   );
    // }

    return builder.build();
  }
}
