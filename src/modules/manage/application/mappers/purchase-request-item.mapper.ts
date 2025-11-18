import { Injectable } from '@nestjs/common';
import { PurchaseRequestItemEntity } from '../../domain/entities/purchase-request-item.entity';
import { PurchaseRequestItemResponse } from '../dto/response/purchase-request-item.response';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { UnitDataMapper } from './unit.mapper';
import { CreatePurchaseRequestItemDto } from '../dto/create/purchaseRequestItem/create.dto';
import { UpdatePurchaseRequestItemDto } from '../dto/create/purchaseRequestItem/update.dto';
import { QuotaCompanyDataMapper } from './quota-company.mapper';

@Injectable()
export class PurchaseRequestItemDataMapper {
  constructor(
    private readonly unit: UnitDataMapper,
    private readonly quotaCompany: QuotaCompanyDataMapper,
  ) {}

  toEntity(
    dto: CreatePurchaseRequestItemDto | UpdatePurchaseRequestItemDto,
    pr_id?: number,
    sum_total: number = 0,
  ): PurchaseRequestItemEntity {
    const builder = PurchaseRequestItemEntity.builder();

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

    if (dto.quota_company_id) {
      builder.setQuotaCompanyId(dto.quota_company_id);
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
  toResponse(entity: PurchaseRequestItemEntity): PurchaseRequestItemResponse {
    const file_name = entity?.file_name
      ? `${process.env.AWS_CLOUDFRONT_DISTRIBUTION_DOMAIN_NAME}/${entity.file_name}`
      : '';
    const response = new PurchaseRequestItemResponse();
    response.id = entity.getId().value;
    response.purchase_request_id = Number(entity.purchase_request_id);
    response.title = entity.title;
    response.file_name = entity.file_name;
    response.file_name_url = file_name;
    response.quantity = Number(entity.quantity);
    response.unit_id = entity.unit_id;
    response.quota_company_id = entity.quota_company_id;
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

    response.quota_company = entity.quota_company
      ? this.quotaCompany.toResponse(entity.quota_company)
      : null;

    return response;
  }
}
