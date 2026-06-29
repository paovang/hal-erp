import { CompanyProductEntity } from '../entities/company-product.entity';
import { CompanyProductId } from '../value-objects/company-product-id.vo';

export class CompanyProductBuilder {
  companyProductId: CompanyProductId;
  companyId: number;
  productId: number;
  status: 'active' | 'inactive';
  company?: { id: number; name: string };
  product?: { id: number; name: string };
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;

  setCompanyProductId(value: CompanyProductId): this {
    this.companyProductId = value;
    return this;
  }

  setCompanyId(companyId: number): this {
    this.companyId = companyId;
    return this;
  }

  setProductId(productId: number): this {
    this.productId = productId;
    return this;
  }

  setStatus(status: 'active' | 'inactive'): this {
    this.status = status;
    return this;
  }

  setCompany(company: { id: number; name: string }): this {
    this.company = company;
    return this;
  }

  setProduct(product: { id: number; name: string }): this {
    this.product = product;
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

  build(): CompanyProductEntity {
    return CompanyProductEntity.create(this);
  }
}
