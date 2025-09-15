import { Injectable } from '@nestjs/common';
import { ReportPurchaseRequestEntity } from '../../domain/entities/report-purchase-request.entity.';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { ReportPurchaseRequestResponse } from '../dto/response/report-purchase-request.response';
import { ReportPurchaseRequestItemDataMapper } from './report-purchase-request-item.mapper';

@Injectable()
export class ReportPurchaseRequestDataMapper {
  constructor(
    private readonly purchaseRequestItemDataMapper: ReportPurchaseRequestItemDataMapper,
    //     private readonly documentMapper: DocumentDataMapper,
    //     private readonly userApprovalMapper: UserApprovalDataMapper,
  ) {}
  /** Mapper Dto To Entity */
  //   toEntity(
  //     dto: any,
  //     pr_code?: string,
  //     document_id?: number,
  //   ): PurchaseRequestEntity {
  //     const builder = PurchaseRequestEntity.builder();
  //     if (document_id) {
  //       builder.setDocumentId(document_id);
  //     }
  //     if (pr_code) {
  //       builder.setPrNumber(pr_code);
  //     }
  //     // if (dto.expired_date) {
  //     //   builder.setExpiredDate(dto.expired_date);
  //     // }
  //     if ('expired_date' in dto && dto.expired_date) {
  //       builder.setExpiredDate(dto.expired_date);
  //     }
  //     // if (dto.purposes) {
  //     //   builder.setPurposes(dto.purposes);
  //     // }
  //     if ('purposes' in dto && dto.purposes) {
  //       builder.setPurposes(dto.purposes);
  //     }
  //     return builder.build();
  //   }
  /** Mapper Entity To Response */
  toResponse(
    entity: ReportPurchaseRequestEntity,
  ): ReportPurchaseRequestResponse {
    console.log('entity', entity);
    const isStepPending = entity.step > 0 ? true : false;
    const response = new ReportPurchaseRequestResponse();
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
    response.total = entity.total;
    response.step = isStepPending;
    // response.document = entity.document
    //   ? this.documentMapper.toResponse(entity.document)
    //   : null;
    // response.user_approval = entity.user_approval
    //   ? this.userApprovalMapper.toResponse(entity.user_approval)
    //   : null;
    response.purchase_request_item =
      entity.purchaseRequestItems?.map((item) => {
        return this.purchaseRequestItemDataMapper.toResponse(item);
      }) ?? null;
    return response;
  }
}
