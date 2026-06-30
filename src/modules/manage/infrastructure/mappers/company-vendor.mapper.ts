import { Injectable } from '@nestjs/common';
import { CompanyVendorOrmEntity } from '@src/common/infrastructure/database/typeorm/company-vendor.orm';
import { CompanyVendorEntity } from '../../domain/entities/company-vendor.entity';
import { CompanyVendorId } from '../../domain/value-objects/company-vendor-id.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import moment from 'moment-timezone';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';

@Injectable()
export class CompanyVendorDataAccessMapper {
  toOrmEntity(
    entity: CompanyVendorEntity,
    method: OrmEntityMethod,
  ): CompanyVendorOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);
    const id = entity.getId();

    const orm = new CompanyVendorOrmEntity();
    if (id) {
      orm.id = id.value;
    }

    orm.company_id = entity.companyId;
    orm.vendor_id = entity.vendorId;
    orm.status = entity.status;
    orm.credit_term_days = entity.creditTermDays;
    orm.credit_limit = entity.creditLimit;
    orm.payment_term = entity.paymentTerm;

    if (method === OrmEntityMethod.CREATE) {
      orm.created_at = entity.createdAt ?? new Date(now);
    }
    orm.updated_at = new Date(now);

    return orm;
  }

  toEntity(ormData: CompanyVendorOrmEntity): CompanyVendorEntity {
    const builder = CompanyVendorEntity.builder()
      .setCompanyVendorId(new CompanyVendorId(ormData.id))
      .setCompanyId(ormData.company_id!)
      .setVendorId(ormData.vendor_id!)
      .setStatus(ormData.status ?? 'active')
      .setCreditTermDays(Number(ormData.credit_term_days ?? 0))
      .setCreditLimit(Number(ormData.credit_limit ?? 0))
      .setPaymentTerm(ormData.payment_term ?? null)
      .setCreatedAt(ormData.created_at)
      .setUpdatedAt(ormData.updated_at)
      .setDeletedAt(ormData.deleted_at);

    if (ormData.company && ormData.company.name) {
      builder.setCompany({
        id: ormData.company.id,
        name: ormData.company.name,
      });
    }

    if (ormData.vendors && ormData.vendors.name) {
      builder.setVendor({
        id: ormData.vendors.id,
        name: ormData.vendors.name,
      });
    }

    return builder.build();
  }
}
