import { ProductEntity } from '../entities/product.entity';
import { QuotaCompanyEntity } from '../entities/quota-company.entity';
import { QuotaCompanyId } from '../value-objects/quota-company-id.vo';

export class QuotaCompanyBuilder {
  quotaId: QuotaCompanyId;
  company_id: number;
  company?: { id: number; name: string };
  vendor_product_id: number;
  vendor_product?: { id: number };
  qty: number;
  year: Date;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;
  product: ProductEntity | null;

  setQuotaId(value: QuotaCompanyId): this {
    this.quotaId = value;
    return this;
  }

  setCompanyId(companyId: number): this {
    this.company_id = companyId;
    return this;
  }

  setCompany(company: { id: number; name: string }): this {
    this.company = company;
    return this;
  }

  setVendorProductId(value: number): this {
    this.vendor_product_id = value;
    return this;
  }

  setVendorProduct(vendor_product: { id: number }): this {
    this.vendor_product = vendor_product;
    return this;
  }

  setQty(qty: number): this {
    this.qty = qty;
    return this;
  }

  setYear(year: Date): this {
    this.year = year;
    return this;
  }

  setCreatedAt(createdAt: Date): this {
    this.createdAt = createdAt;
    return this;
  }

  setUpdatedAt(updatedAt: Date | null): this {
    this.updatedAt = updatedAt;
    return this;
  }

  setDeletedAt(deletedAt: Date | null): this {
    this.deletedAt = deletedAt;
    return this;
  }

  setProduct(product: ProductEntity | null): this {
    this.product = product;
    return this;
  }

  build(): QuotaCompanyEntity {
    return QuotaCompanyEntity.create(this);
  }
}
