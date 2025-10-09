import { CurrencyEntity } from '../entities/currency.entity';
import { ExchangeRateEntity } from '../entities/exchange-rate.entity';
import { ExchangeRateId } from '../value-objects/exchange-rate-id.vo';

export class ExchangeRateBuilder {
  exchangeRateId: ExchangeRateId;
  from_currency_id: number;
  to_currency_id: number;
  rate: number;
  is_active: boolean;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;
  from_currency: CurrencyEntity | null;
  to_currency: CurrencyEntity | null;

  setExchangeRateId(value: ExchangeRateId): this {
    this.exchangeRateId = value;
    return this;
  }

  setFromCurrencyId(from_currency_id: number): this {
    this.from_currency_id = from_currency_id;
    return this;
  }
  setToCurrencyId(to_currency_id: number): this {
    this.to_currency_id = to_currency_id;
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
  setFromCurrency(from_currency: CurrencyEntity | null): this {
    this.from_currency = from_currency;
    return this;
  }
  setToCurrency(to_currency: CurrencyEntity | null): this {
    this.to_currency = to_currency;
    return this;
  }

  build(): ExchangeRateEntity {
    return ExchangeRateEntity.create(this);
  }
}
