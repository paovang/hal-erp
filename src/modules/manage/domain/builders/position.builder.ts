import { PositionEntity } from "../entities/position.entity";
import { PositionId } from "../value-objects/position-id.vo";

export class PositionBuilder {
  positionId: PositionId;
  name: string;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;

  setPositionId(value: PositionId): this {
    this.positionId = value;
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

  build(): PositionEntity {
    return PositionEntity.create(this);
  }
}