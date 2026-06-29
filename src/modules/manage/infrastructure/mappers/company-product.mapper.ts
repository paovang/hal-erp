import { CompanyProductOrmEntity } from '@src/common/infrastructure/database/typeorm/company-product.orm';
import { CompanyProductEntity } from '../../domain/entities/company-product.entity';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import moment from 'moment-timezone';
import { CompanyProductId } from '../../domain/value-objects/company-product-id.vo';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';

export class CompanyProductDataAccessMapper {
  toOrmEntity(
    companyProductEntity: CompanyProductEntity,
    method: OrmEntityMethod,
  ): CompanyProductOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);
    const id = companyProductEntity.getId();

    const companyProductOrmEntity = new CompanyProductOrmEntity();
    if (id) {
      companyProductOrmEntity.id = id.value;
    }

    companyProductOrmEntity.company_id = companyProductEntity.companyId;
    companyProductOrmEntity.product_id = companyProductEntity.productId;
    if (companyProductEntity.status) {
      companyProductOrmEntity.status = companyProductEntity.status;
    }

    if (method === OrmEntityMethod.CREATE) {
      companyProductOrmEntity.created_at =
        companyProductEntity.createdAt ?? new Date(now);
    }

    companyProductOrmEntity.updated_at = new Date(now);

    return companyProductOrmEntity;
  }

  toEntity(ormData: CompanyProductOrmEntity): CompanyProductEntity {
    const builder = CompanyProductEntity.builder()
      .setCompanyProductId(new CompanyProductId(ormData.id))
      .setCompanyId(ormData.company_id!)
      .setProductId(ormData.product_id!)
      .setStatus(ormData.status)
      .setCreatedAt(ormData.created_at)
      .setUpdatedAt(ormData.updated_at)
      .setDeletedAt(ormData.deleted_at);

    // Set company and product if they exist
    if (ormData.company && ormData.company.name) {
      builder.setCompany({
        id: ormData.company.id,
        name: ormData.company.name,
      });
    }

    if (ormData.product && ormData.product.name) {
      builder.setProduct({
        id: ormData.product.id,
        name: ormData.product.name,
      });
    }

    return builder.build();
  }
}
