import { UnitEntity } from '../entities/unit.entity';
import { UnitId } from '../value-objects/unit-id.vo';

export class UnitBuilder {
  unitId: UnitId;
  name: string;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;

  setUnitId(value: UnitId): this {
    this.unitId = value;
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

  build(): UnitEntity {
    return UnitEntity.create(this);
  }
}
