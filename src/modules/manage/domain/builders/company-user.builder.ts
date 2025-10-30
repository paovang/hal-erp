import { CompanyUserId } from '../value-objects/company-user-id.vo';
import { CompanyUserEntity } from '../entities/company-user.entity';
import { UserEntity } from '../entities/user.entity';
import { CompanyEntity } from '../entities/company.entity';

export class CompanyUserBuilder {
  companyUserId: CompanyUserId;
  company_id: number;
  user_id: number;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;
  user: UserEntity | null;
  company: CompanyEntity | null;

  setCompanyUserId(value: CompanyUserId): this {
    this.companyUserId = value;
    return this;
  }

  setCompanyId(company_id: number): this {
    this.company_id = company_id;
    return this;
  }

  setUserId(user_id: number): this {
    this.user_id = user_id;
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

  setUser(user: UserEntity | null): this {
    this.user = user;
    return this;
  }

  setCompany(company: CompanyEntity | null): this {
    this.company = company;
    return this;
  }

  build(): CompanyUserEntity {
    return CompanyUserEntity.create(this);
  }
}
