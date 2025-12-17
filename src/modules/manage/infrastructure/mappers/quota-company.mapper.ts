import { QuotaCompanyEntity } from '../../domain/entities/quota-company.entity';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import moment from 'moment-timezone';
import { QuotaCompanyId } from '../../domain/value-objects/quota-company-id.vo';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { QuotaCompanyOrmEntity } from '@src/common/infrastructure/database/typeorm/quota-company.orm';
import { Injectable } from '@nestjs/common';
import { ProductDataAccessMapper } from './product.mapper';
import { VendorProductDataAccessMapper } from './vendor-product.mapper';
import { VendorDataAccessMapper } from './vendor.mapper';
import { EnumDocumentStatus } from '../../application/constants/status-key.const';

@Injectable()
export class QuotaCompanyDataAccessMapper {
  constructor(
    private readonly productDataAccessMapper: ProductDataAccessMapper,
    private readonly vendorProductDataAccessMapper: VendorProductDataAccessMapper,
    private readonly vendor: VendorDataAccessMapper,
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
    let usedQty = 0;

    const documents = ormData.company?.documents ?? [];

    for (const doc of documents) {
      if (!doc.receipts) continue; // ป้องกัน null/undefined

      for (const receipt of doc.receipts.receipt_items) {
        usedQty += Number(receipt.quantity ?? 0);
      }
    }

    const totalQty = Number(ormData.qty ?? 0);
    // const remainingQty = Math.max(totalQty - usedQty, 0); // กันติดลบ
    const qty = totalQty - usedQty;

    const builder = QuotaCompanyEntity.builder()
      .setQuotaId(new QuotaCompanyId(ormData.id))
      .setYear(ormData.year || new Date())
      .setCompanyId(ormData.company_id || 0)
      .setVendorProductId(ormData.vendor_product_id || 0)
      .setQty(qty)
      .setDeletedAt(ormData.deleted_at)
      .setCreatedAt(ormData.created_at)
      .setPurchaseRequestItems(ormData.purchase_request_items)
      .setUpdatedAt(ormData.updated_at);

    if (ormData.company) {
      builder.setCompany({
        id: ormData.company.id,
        name: ormData.company.name || '',
      });
    }

    if (ormData.vendor_product) {
      builder.setVendorProduct(
        this.vendorProductDataAccessMapper.toEntity(ormData.vendor_product),
      );

      if (ormData.vendor_product.products) {
        builder.setProduct(
          this.productDataAccessMapper.toEntity(
            ormData.vendor_product.products,
          ),
        );
      }

      if (ormData.vendor_product.vendors) {
        builder.setVendor(this.vendor.toEntity(ormData.vendor_product.vendors));
      }
    }

    return builder.build();
  }
}
