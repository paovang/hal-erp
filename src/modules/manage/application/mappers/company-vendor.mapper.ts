import { Injectable } from '@nestjs/common';
import { CreateCompanyVendorDto } from '../dto/create/company-vendor/create.dto';
import { CompanyVendorEntity } from '../../domain/entities/company-vendor.entity';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import moment from 'moment-timezone';
import { CompanyVendorResponse } from '../dto/response/company-vendor.response';
import { UpdateCompanyVendorDto } from '../dto/create/company-vendor/update.dto';

@Injectable()
export class CompanyVendorDataMapper {
  /** Mapper Dto To Entity */
  toEntity(
    dto: CreateCompanyVendorDto | UpdateCompanyVendorDto,
  ): CompanyVendorEntity {
    const builder = CompanyVendorEntity.builder();

    if ('company_id' in dto && dto.company_id) {
      builder.setCompanyId(dto.company_id);
    }

    if ('vendor_id' in dto && dto.vendor_id) {
      builder.setVendorId(dto.vendor_id);
    }

    if ('status' in dto && dto.status) {
      builder.setStatus(dto.status);
    }

    if ('credit_term_days' in dto && dto.credit_term_days !== undefined) {
      builder.setCreditTermDays(dto.credit_term_days);
    }

    if ('credit_limit' in dto && dto.credit_limit !== undefined) {
      builder.setCreditLimit(dto.credit_limit);
    }

    if ('payment_term' in dto && dto.payment_term !== undefined) {
      builder.setPaymentTerm(dto.payment_term ?? null);
    }

    return builder.build();
  }

  /** Mapper Entity To Response */
  toResponse(entity: CompanyVendorEntity): CompanyVendorResponse {
    const response = new CompanyVendorResponse();
    response.id = entity.getId().value;
    response.company_id = entity.companyId;
    response.vendor_id = entity.vendorId;
    response.company = entity.company;
    response.vendor = entity.vendor;
    response.status = entity.status;
    response.credit_term_days = entity.creditTermDays;
    response.credit_limit = entity.creditLimit;
    response.payment_term = entity.paymentTerm;

    response.created_at = moment
      .tz(entity.createdAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.updated_at = moment
      .tz(entity.updatedAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    return response;
  }
}
