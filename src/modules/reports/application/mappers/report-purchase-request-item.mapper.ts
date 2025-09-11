import { Injectable } from '@nestjs/common';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { ReportPurchaseRequestItemEntity } from '../../domain/entities/report-purchase-request-item.entity';
import { ReportPurchaseRequestItemResponse } from '../dto/response/report-purchase-request-item.response';

@Injectable()
export class ReportPurchaseRequestItemDataMapper {
  // constructor(private readonly unit: UnitDataMapper) {}

  toEntity(
    dto: any,
    pr_id?: number,
    sum_total: number = 0,
  ): ReportPurchaseRequestItemEntity {
    const builder = ReportPurchaseRequestItemEntity.builder();

    if (pr_id) {
      builder.setPurchaseRequestId(pr_id);
    }

    if (dto.title) {
      builder.setTitle(dto.title);
    }

    if (dto.file_name) {
      builder.setFileName(dto.file_name);
    }

    if (dto.quantity) {
      builder.setQuantity(dto.quantity);
    }

    if (dto.unit_id) {
      builder.setUnitId(dto.unit_id);
    }

    if (dto.price) {
      builder.setPrice(dto.price);
    }

    if (sum_total) {
      builder.setTotalPrice(sum_total);
    }

    if (dto.remark) {
      builder.setRemark(dto.remark);
    }

    return builder.build();
  }

  /** Mapper Entity To Response */
  toResponse(
    entity: ReportPurchaseRequestItemEntity,
  ): ReportPurchaseRequestItemResponse {
    const file_name = entity?.file_name
      ? `${process.env.AWS_CLOUDFRONT_DISTRIBUTION_DOMAIN_NAME}/${entity.file_name}`
      : '';
    const response = new ReportPurchaseRequestItemResponse();
    response.id = entity.getId().value;
    response.purchase_request_id = Number(entity.purchase_request_id);
    response.title = entity.title;
    response.file_name = entity.file_name;
    response.file_name_url = file_name;
    response.quantity = entity.quantity;
    response.unit_id = entity.unit_id;
    response.price = entity.price;
    response.total_price = entity.total_price;
    response.remark = entity.remark;
    response.created_at = moment
      .tz(entity.createdAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.updated_at = moment
      .tz(entity.createdAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);

    // response.unit = entity.unit ? this.unit.toResponse(entity.unit) : null;

    return response;
  }
}
