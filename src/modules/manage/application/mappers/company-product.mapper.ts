import { Injectable } from '@nestjs/common';
import { CreateCompanyProductDto } from '../dto/create/company-product/create.dto';
import { CompanyProductEntity } from '../../domain/entities/company-product.entity';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import moment from 'moment-timezone';
import { CompanyProductResponse } from '../dto/response/company-product.response';
import { UpdateCompanyProductDto } from '../dto/create/company-product/update.dto';

@Injectable()
export class CompanyProductDataMapper {
  /** Mapper Dto To Entity */
  toEntity(
    dto: CreateCompanyProductDto | UpdateCompanyProductDto,
  ): CompanyProductEntity {
    const builder = CompanyProductEntity.builder();

    if ('company_id' in dto && dto.company_id) {
      builder.setCompanyId(dto.company_id);
    }

    if ('product_id' in dto && dto.product_id) {
      builder.setProductId(dto.product_id);
    }

    if ('status' in dto && dto.status) {
      builder.setStatus(dto.status);
    }

    return builder.build();
  }

  /** Mapper Entity To Response */
  toResponse(entity: CompanyProductEntity): CompanyProductResponse {
    const response = new CompanyProductResponse();
    response.id = entity.getId().value;
    response.company_id = entity.companyId;
    response.product_id = entity.productId;
    response.company = entity.company;
    response.product = entity.product;
    response.status = entity.status;

    response.created_at = moment
      .tz(entity.createdAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.updated_at = moment
      .tz(entity.updatedAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    return response;
  }
}
