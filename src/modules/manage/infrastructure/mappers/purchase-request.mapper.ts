import { Injectable } from '@nestjs/common';
import { PurchaseRequestOrmEntity } from '@src/common/infrastructure/database/typeorm/purchase-request.orm';
import { PurchaseRequestEntity } from '../../domain/entities/purchase-request.entity';
import { PurchaseRequestId } from '../../domain/value-objects/purchase-request-id.vo';
import { PurchaseRequestItemDataAccessMapper } from './purchase-request-item.mapper';
import { DocumentDataAccessMapper } from './document.mapper';
import { UserApprovalDataAccessMapper } from './user-approval.mapper';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';

@Injectable()
export class PurchaseRequestDataAccessMapper {
  constructor(
    private readonly purchaseRequestItemMapper: PurchaseRequestItemDataAccessMapper,
    private readonly documentMapper: DocumentDataAccessMapper,
    private readonly userApprovalMapper: UserApprovalDataAccessMapper,
  ) {}

  toOrmEntity(
    prEntity: PurchaseRequestEntity,
    method: OrmEntityMethod,
  ): PurchaseRequestOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);
    const id = prEntity.getId();

    const mediaOrmEntity = new PurchaseRequestOrmEntity();
    if (id) {
      mediaOrmEntity.id = id.value;
    }

    mediaOrmEntity.document_id = prEntity.document_id;
    mediaOrmEntity.pr_number = prEntity.pr_number;
    if (method === OrmEntityMethod.CREATE) {
      mediaOrmEntity.requested_date = new Date(now);
    }
    mediaOrmEntity.expired_date = prEntity.expired_date;
    mediaOrmEntity.purposes = prEntity.purposes;
    if (method === OrmEntityMethod.CREATE) {
      mediaOrmEntity.created_at = prEntity.createdAt ?? new Date(now);
    }
    mediaOrmEntity.updated_at = new Date(now);

    return mediaOrmEntity;
  }

  toEntity(ormData: PurchaseRequestOrmEntity): PurchaseRequestEntity {
    const builder = PurchaseRequestEntity.builder()
      .setPurchaseRequestId(new PurchaseRequestId(ormData.id))
      .setDocumentId(ormData.document_id ?? 0)
      .setPrNumber(ormData.pr_number)
      .setRequestedDate(ormData.requested_date ?? new Date())
      .setExpiredDate(ormData.expired_date ?? new Date())
      .setPurposes(ormData.purposes ?? '')
      .setCreatedAt(ormData.created_at)
      .setUpdatedAt(ormData.updated_at);

    if (ormData.documents) {
      builder.setDocument(this.documentMapper.toEntity(ormData.documents));
    }

    if (ormData.documents && ormData.documents.user_approvals) {
      builder.setUserApproval(
        this.userApprovalMapper.toEntity(ormData.documents.user_approvals),
      );
    }

    if (ormData.purchase_request_items) {
      builder.setPurchaseRequestItem(
        ormData.purchase_request_items.map((item) =>
          this.purchaseRequestItemMapper.toEntity(item),
        ),
      );
    }

    return builder.build();
  }
}
