import { Injectable } from '@nestjs/common';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import moment from 'moment-timezone';
import { CreateQuotaCompanyDto } from '../dto/create/QuotaCompany/create.dto';
import { UpdateQuotaCompanyDto } from '../dto/create/QuotaCompany/update.dto';
import { QuotaCompanyEntity } from '../../domain/entities/quota-company.entity';
import { QuotaCompanyResponse } from '../dto/response/quota-company.response';
import { ProductDataMapper } from './product.mapper';
import { VendorProductDataMapper } from './vendor-product.mapper';
import { VendorDataMapper } from './vendor.mapper';

@Injectable()
export class QuotaCompanyDataMapper {
  constructor(
    private readonly productDataMapper: ProductDataMapper,
    private readonly vendorProductDataMapper: VendorProductDataMapper,
    private readonly vendor: VendorDataMapper,
  ) {}
  /** Mapper Dto To Entity */
  toEntity(
    dto: CreateQuotaCompanyDto | UpdateQuotaCompanyDto,
    company_id: number,
  ): QuotaCompanyEntity {
    const builder = QuotaCompanyEntity.builder();

    if (dto.qty) {
      builder.setQty(dto.qty);
    }
    if (dto.year) {
      builder.setYear(dto.year);
    }

    if (company_id) {
      builder.setCompanyId(company_id);
    }

    if (dto.vendor_product_id) {
      builder.setVendorProductId(dto.vendor_product_id);
    }

    return builder.build();
  }

  /** Mapper Entity To Response */
  toResponse(entity: QuotaCompanyEntity): QuotaCompanyResponse {
    const response = new QuotaCompanyResponse();
    response.id = entity.getId().value;
    response.year = entity.year;
    response.qty = entity.qty;
    response.vendor_product_id = entity.vendor_product_id;
    response.company_id = entity.companyId;
    response.created_at = moment
      .tz(entity.createdAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.updated_at = moment
      .tz(entity.updatedAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);

    response.vendor_product = entity.vendor_product
      ? this.vendorProductDataMapper.toResponse(entity.vendor_product)
      : null;

    response.Product = entity.product
      ? this.productDataMapper.toResponse(entity.product)
      : null;

    response.vendor = entity.vendor
      ? this.vendor.toResponse(entity.vendor)
      : null;

    return response;
  }
}
