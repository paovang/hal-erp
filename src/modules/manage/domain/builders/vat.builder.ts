import { VatEntity } from '../entities/vat.entity';
import { VatId } from '../value-objects/vat-id.vo';

export class VatBuilder {
  vatId: VatId;
  amount: number;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;

  setVatId(value: VatId): this {
    this.vatId = value;
    return this;
  }

  setAmount(amount: number): this {
    this.amount = amount;
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

  build(): VatEntity {
    return VatEntity.create(this);
  }
}
