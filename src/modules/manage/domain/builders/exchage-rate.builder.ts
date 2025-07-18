import { ExchangeRateEntity } from '../entities/exchange-rate.entity';
import { ExchangeRateId } from '../value-objects/exchange-rate-id.vo';

export class ExchangeRateBuilder {
  exchangeRateId: ExchangeRateId;
  from_currency: number;
  to_currency: number;
  rate: number;
  is_active: boolean;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;

  setExchangeRateId(value: ExchangeRateId): this {
    this.exchangeRateId = value;
    return this;
  }

  setFromCurrency(from_currency: number): this {
    this.from_currency = from_currency;
    return this;
  }
  setToCurrency(to_currency: number): this {
    this.to_currency = to_currency;
    return this;
  }
  setRate(rate: number): this {
    this.rate = rate;
    return this;
  }
  setIsActive(is_active: boolean): this {
    this.is_active = is_active;
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

  build(): ExchangeRateEntity {
    return ExchangeRateEntity.create(this);
  }
}
