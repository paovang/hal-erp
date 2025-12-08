import { CompanyEntity } from '@src/modules/manage/domain/entities/company.entity';
import { CompanyId } from '@src/modules/manage/domain/value-objects/company-id.vo';

export class CompanyBuilder {
  companyId: CompanyId;
  name: string;
  logo: string;
  tel: string;
  email: string;
  address: string;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;
  receipt_count: number;
  total_allocated: number;
  total_used_amount: number;

  setCompanyId(value: CompanyId): this {
    this.companyId = value;
    return this;
  }

  setName(name: string): this {
    this.name = name;
    return this;
  }

  setLogo(value: string): this {
    this.logo = value;
    return this;
  }

  setTel(value: string): this {
    this.tel = value;
    return this;
  }

  setEmail(value: string): this {
    this.email = value;
    return this;
  }

  setAddress(value: string): this {
    this.address = value;
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

  setReceiptCount(receipt_count: number): this {
    this.receipt_count = receipt_count;
    return this;
  }

  setTotalAllocated(total_allocated: number): this {
    this.total_allocated = total_allocated;
    return this;
  }

  setTotalUsedAmount(total_used_amount: number): this {
    this.total_used_amount = total_used_amount;
    return this;
  }

  build(): CompanyEntity {
    return CompanyEntity.create(this);
  }
}
