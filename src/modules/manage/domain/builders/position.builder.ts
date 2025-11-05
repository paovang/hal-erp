import { CompanyEntity } from '../entities/company.entity';
import { PositionEntity } from '../entities/position.entity';
import { PositionId } from '../value-objects/position-id.vo';

export class PositionBuilder {
  positionId: PositionId;
  name: string;
  company_id: number;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;
  company: CompanyEntity | null;

  setPositionId(value: PositionId): this {
    this.positionId = value;
    return this;
  }

  setName(name: string): this {
    this.name = name;
    return this;
  }

  setCompanyId(company_id: number): this {
    this.company_id = company_id;
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

  setCompany(company: CompanyEntity | null): this {
    this.company = company;
    return this;
  }

  build(): PositionEntity {
    return PositionEntity.create(this);
  }
}
