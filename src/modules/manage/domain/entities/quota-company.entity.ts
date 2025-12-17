import { Entity } from '@src/common/domain/entities/entity';
import { QuotaCompanyBuilder } from '../builders/quota-company.builder';
import { QuotaCompanyId } from '../value-objects/quota-company-id.vo';
import { BadRequestException } from '@nestjs/common';
import { ProductEntity } from './product.entity';
import { VendorProductEntity } from './vendor-product.entity';
import { VendorEntity } from './vendor.entity';
import { PurchaseRequestItemOrmEntity } from '@src/common/infrastructure/database/typeorm/purchase-request-item.orm';

export class QuotaCompanyEntity extends Entity<QuotaCompanyId> {
  private readonly _qty: number;
  private readonly _year: Date;
  private readonly _company_id: number;
  private readonly _company?: { id: number; name: string };
  private readonly _vendor_product_id: number;
  // private readonly _vendor_product?: { id: number };
  private readonly _purchase_request_items:
    | PurchaseRequestItemOrmEntity[]
    | null;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date | null;
  private readonly _deletedAt: Date | null;
  private readonly _vendor_product: VendorProductEntity | null;
  private readonly _product: ProductEntity | null;
  private readonly _vendor: VendorEntity | null;

  private constructor(builder: QuotaCompanyBuilder) {
    super();
    this.setId(builder.quotaId);
    this._qty = builder.qty;
    this._year = builder.year;
    this._company_id = builder.company_id;
    this._company = builder.company;
    this._vendor_product_id = builder.vendor_product_id;
    this._vendor_product = builder.vendor_product;
    this._createdAt = builder.createdAt;
    this._updatedAt = builder.updatedAt ?? null;
    this._deletedAt = builder.deletedAt ?? null;
    this._product = builder.product ?? null;
    this._vendor = builder.vendor ?? null;
  }

  get qty(): number {
    return this._qty;
  }

  get year(): Date {
    return this._year;
  }

  get companyId(): number {
    return this._company_id;
  }

  get company(): { id: number; name: string } | undefined {
    return this._company;
  }

  get vendor_product_id(): number {
    return this._vendor_product_id;
  }

  get vendor_product(): VendorProductEntity | null {
    return this._vendor_product;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date | null {
    return this._updatedAt;
  }

  get deletedAt(): Date | null {
    return this._deletedAt;
  }

  get product(): ProductEntity | null {
    return this._product;
  }

  get vendor(): VendorEntity | null {
    return this._vendor;
  }

  get purchase_request_items(): PurchaseRequestItemOrmEntity[] | null {
    return this._purchase_request_items;
  }

  public static builder(): QuotaCompanyBuilder {
    return new QuotaCompanyBuilder();
  }

  static create(builder: QuotaCompanyBuilder): QuotaCompanyEntity {
    return new QuotaCompanyEntity(builder);
  }

  static getEntityName() {
    return 'quota_company';
  }

  async validateExistingIdForUpdate() {
    if (!this.getId()) {
      console.log('phoudvang');
      throw new BadRequestException(
        'users.user_is_not_in_correct_state_for_initialization',
      );
    }
  }

  async initializeUpdateSetId(quotaId: QuotaCompanyId) {
    this.setId(quotaId);
  }
}
