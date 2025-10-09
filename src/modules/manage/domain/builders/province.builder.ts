import { ProvinceEntity } from '../entities/province.entity';
import { ProvinceId } from '../value-objects/province-id.vo';

export class ProvinceBuilder {
  provinceId: ProvinceId;
  name: string;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;

  setProvinceId(value: ProvinceId): this {
    this.provinceId = value;
    return this;
  }

  setName(name: string): this {
    this.name = name;
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

  build(): ProvinceEntity {
    return ProvinceEntity.create(this);
  }
}
