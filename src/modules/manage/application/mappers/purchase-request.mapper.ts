import { Injectable } from '@nestjs/common';
import { PurchaseRequestEntity } from '../../domain/entities/purchase-request.entity';
import { PurchaseRequestResponse } from '../dto/response/purchase-request.response';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import moment from 'moment-timezone';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { CreatePurchaseRequestDto } from '../dto/create/purchaseRequest/create.dto';
import { PurchaseRequestItemDataMapper } from './purchase-request-item.mapper';
import { DocumentDataMapper } from './document.mapper';
import { UserApprovalDataMapper } from './user-approval.mapper';
import { UpdatePurchaseRequestDto } from '../dto/create/purchaseRequest/update.dto';

@Injectable()
export class PurchaseRequestDataMapper {
  constructor(
    private readonly purchaseRequestItemDataMapper: PurchaseRequestItemDataMapper,
    private readonly documentMapper: DocumentDataMapper,
    private readonly userApprovalMapper: UserApprovalDataMapper,
  ) {}
  /** Mapper Dto To Entity */
  toEntity(
    dto: CreatePurchaseRequestDto | UpdatePurchaseRequestDto,
    pr_code?: string,
    document_id?: number,
  ): PurchaseRequestEntity {
    const builder = PurchaseRequestEntity.builder();

    if (document_id) {
      builder.setDocumentId(document_id);
    }

    if (pr_code) {
      builder.setPrNumber(pr_code);
    }

    if (dto.expired_date) {
      builder.setExpiredDate(dto.expired_date);
    }

    if (dto.purposes) {
      builder.setPurposes(dto.purposes);
    }

    return builder.build();
  }

  /** Mapper Entity To Response */
  toResponse(entity: PurchaseRequestEntity): PurchaseRequestResponse {
    const response = new PurchaseRequestResponse();
    response.id = Number(entity.getId().value);
    response.document_id = Number(entity.document_id);
    response.pr_number = entity.pr_number;
    response.requested_date = moment
      .tz(entity.requested_date, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.expired_date = moment
      .tz(entity.expired_date, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.purposes = entity.purposes;
    response.created_at = moment
      .tz(entity.createdAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.updated_at = moment
      .tz(entity.updatedAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);

    response.document = entity.document
      ? this.documentMapper.toResponse(entity.document)
      : null;

    response.user_approval = entity.user_approval
      ? this.userApprovalMapper.toResponse(entity.user_approval)
      : null;

    response.purchase_request_item =
      entity.purchaseRequestItems?.map((item) => {
        return this.purchaseRequestItemDataMapper.toResponse(item);
      }) ?? null;

    return response;
  }
}
