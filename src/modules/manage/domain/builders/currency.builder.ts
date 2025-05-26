import { CurrencyEntity } from '../entities/currency.entity';
import { CurrencyId } from '../value-objects/currency-id.vo';

export class CurrencyBuilder {
  currencyId: CurrencyId;
  code: string;
  name: string;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;

  setCurrencyId(value: CurrencyId): this {
    this.currencyId = value;
    return this;
  }

  setCode(code: string): this {
    this.code = code;
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

  build(): CurrencyEntity {
    return CurrencyEntity.create(this);
  }
}
