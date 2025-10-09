import { Injectable } from '@nestjs/common';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { ReportPurchaseRequestItemEntity } from '../../domain/entities/report-purchase-request-item.entity';
import { ReportPurchaseRequestItemResponse } from '../dto/response/report-purchase-request-item.response';
import { UnitDataMapper } from '@src/modules/manage/application/mappers/unit.mapper';

@Injectable()
export class ReportPurchaseRequestItemDataMapper {
  constructor(private readonly unit: UnitDataMapper) {}

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
    response.quantity = Number(entity.quantity);
    response.unit_id = entity.unit_id;
    response.price = Number(entity.price);
    response.total_price = Number(entity.total_price);
    response.remark = entity.remark;
    response.created_at = moment
      .tz(entity.createdAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.updated_at = moment
      .tz(entity.createdAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);

    response.unit = entity.unit ? this.unit.toResponse(entity.unit) : null;

    return response;
  }
}
