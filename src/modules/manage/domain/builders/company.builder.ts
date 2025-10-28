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

  build(): CompanyEntity {
    return CompanyEntity.create(this);
  }
}