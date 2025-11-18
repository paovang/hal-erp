import { QuotaCompanyEntity } from '../../domain/entities/quota-company.entity';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import moment from 'moment-timezone';
import { QuotaCompanyId } from '../../domain/value-objects/quota-company-id.vo';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { QuotaCompanyOrmEntity } from '@src/common/infrastructure/database/typeorm/quota-company.orm';
import { Injectable } from '@nestjs/common';
import { ProductDataAccessMapper } from './product.mapper';

@Injectable()
export class QuotaCompanyDataAccessMapper {
  constructor(
    private readonly productDataAccessMapper: ProductDataAccessMapper,
  ) {}
  toOrmEntity(
    quotaCompanyEntity: QuotaCompanyEntity,
    method: OrmEntityMethod,
  ): QuotaCompanyOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);
    const id = quotaCompanyEntity.getId();

    const mediaOrmEntity = new QuotaCompanyOrmEntity();
    if (id) {
      mediaOrmEntity.id = id.value;
    }
    mediaOrmEntity.year = quotaCompanyEntity.year;
    mediaOrmEntity.company_id = quotaCompanyEntity.companyId;
    mediaOrmEntity.vendor_product_id = quotaCompanyEntity.vendor_product_id;
    mediaOrmEntity.qty = quotaCompanyEntity.qty;
    if (method === OrmEntityMethod.CREATE) {
      mediaOrmEntity.created_at = quotaCompanyEntity.createdAt ?? new Date(now);
    }
    mediaOrmEntity.updated_at = new Date(now);

    return mediaOrmEntity;
  }

  toEntity(ormData: QuotaCompanyOrmEntity): QuotaCompanyEntity {
    const builder = QuotaCompanyEntity.builder()
      .setQuotaId(new QuotaCompanyId(ormData.id))
      .setYear(ormData.year || new Date())
      .setCompanyId(ormData.company_id || 0)
      .setVendorProductId(ormData.vendor_product_id || 0)
      .setQty(ormData.qty || 0)
      .setDeletedAt(ormData.deleted_at)
      .setCreatedAt(ormData.created_at)
      .setUpdatedAt(ormData.updated_at);
    if (ormData.company) {
      builder.setCompany({
        id: ormData.company.id,
        name: ormData.company.name || '',
      });
    }

    if (ormData.vendor_product) {
      builder.setVendorProduct({
        id: ormData.vendor_product.id,
      });

      if (ormData.vendor_product.products) {
        builder.setProduct(
          this.productDataAccessMapper.toEntity(
            ormData.vendor_product.products,
          ),
        );
      }
    }

    return builder.build();
  }
}
