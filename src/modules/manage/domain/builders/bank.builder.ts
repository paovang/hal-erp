import { BankEntity } from '../entities/bank.entity';
import { BankId } from '../value-objects/bank-id.vo';

export class BankBuilder {
  BankId: BankId;
  short_name: string;
  name: string;
  logo: any;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;

  setBankId(value: BankId): this {
    this.BankId = value;
    return this;
  }

  setShortName(short_name: string): this {
    this.short_name = short_name;
    return this;
  }

  setName(name: string): this {
    this.name = name;
    return this;
  }
  setLogo(logo: any): this {
    this.logo = logo;
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

  build(): BankEntity {
    return BankEntity.create(this);
  }
}
