import { Injectable } from '@nestjs/common';
import { PurchaseRequestOrmEntity } from '@src/common/infrastructure/database/typeorm/purchase-request.orm';
import { ReportPurchaseRequestEntity } from '../../domain/entities/report-purchase-request.entity.';
import { ReportPurchaseRequestId } from '../../domain/value-objects/report-purchase-request-id.vo';
import { ReportPurchaseRequestItemDataAccessMapper } from './report-purchase-request-item.mapper';
import { DocumentDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/document.mapper';
import { UserApprovalDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/user-approval.mapper';
// import { ReportPurchaseRequestItemDataAccessMapper } from './report-purchase-request-item.mapper';

@Injectable()
export class ReportPurchaseRequestDataAccessMapper {
  constructor(
    private readonly purchaseRequestItemMapper: ReportPurchaseRequestItemDataAccessMapper,
    private readonly documentMapper: DocumentDataAccessMapper,
    private readonly userApprovalMapper: UserApprovalDataAccessMapper,
  ) {}
  toEntity(
    ormData: PurchaseRequestOrmEntity,
    step: number = 0,
  ): ReportPurchaseRequestEntity {
    const items = ormData.purchase_request_items || [];
    const itemCount = items.length;
    interface PurchaseRequestItemLike {
      total_price?: number;
      [key: string]: any;
    }

    const total: number = items.reduce(
      (sum: number, item: PurchaseRequestItemLike) =>
        sum + Number(item.total_price || 0),
      0,
    );

    const totalWorkflowStep = 0;
    const builder = ReportPurchaseRequestEntity.builder()
      .setPurchaseRequestId(new ReportPurchaseRequestId(ormData.id))
      .setDocumentId(ormData.document_id ?? 0)
      .setPrNumber(ormData.pr_number)
      .setRequestedDate(ormData.requested_date ?? new Date())
      .setExpiredDate(ormData.expired_date ?? new Date())
      .setPurposes(ormData.purposes ?? '')
      .setCreatedAt(ormData.created_at)
      .setUpdatedAt(ormData.updated_at)
      .setDeletedAt(ormData.deleted_at)
      .setItemCount(itemCount)
      .setTotal(total)
      .setWorkflowStepTotal(totalWorkflowStep ?? 0)
      .setStep(step);

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
