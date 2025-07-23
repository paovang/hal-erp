import { Entity } from '@src/common/domain/entities/entity';
import { BadRequestException } from '@nestjs/common';
import { VatId } from '../value-objects/vat-id.vo';
import { ExchangeRateId } from '../value-objects/exchange-rate-id.vo';
import { ExchangeRateBuilder } from '../builders/exchage-rate.builder';
import { CurrencyEntity } from './currency.entity';

export class ExchangeRateEntity extends Entity<ExchangeRateId> {
  private readonly _from_currency_id: number;
  private readonly _to_currency_id: number;
  private readonly _rate: number;
  private readonly _is_active: boolean;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date | null;
  private readonly _deletedAt: Date | null;
  private readonly _from_currency: CurrencyEntity | null;
  private readonly _to_currency: CurrencyEntity | null;

  private constructor(builder: ExchangeRateBuilder) {
    super();
    this.setId(builder.exchangeRateId);
    this._from_currency_id = builder.from_currency_id;
    this._to_currency_id = builder.to_currency_id;
    this._rate = builder.rate;
    this._is_active = builder.is_active;
    this._updatedAt = builder.updatedAt ?? null;
    this._deletedAt = builder.deletedAt ?? null;
    this._from_currency = builder.from_currency;
    this._to_currency = builder.to_currency;
  }

  get from_currency_id(): number {
    return this._from_currency_id;
  }
  get to_currency_id(): number {
    return this._to_currency_id;
  }
  get rate(): number {
    return this._rate;
  }
  get is_active(): boolean {
    return this._is_active;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date | null {
    return this._updatedAt;
  }

  get deletedAt(): Date | null {
    return this._deletedAt;
  }
  get from_currency(): CurrencyEntity | null {
    return this._from_currency;
  }
  get to_currency(): CurrencyEntity | null {
    return this._to_currency;
  }
  public static builder(): ExchangeRateBuilder {
    return new ExchangeRateBuilder();
  }

  static create(builder: ExchangeRateBuilder): ExchangeRateEntity {
    return new ExchangeRateEntity(builder);
  }

  static getEntityAmount() {
    return 'vat';
  }

  async validateExistingIdForUpdate() {
    if (!this.getId()) {
      throw new BadRequestException(
        'users.user_is_not_in_correct_state_for_initialization',
      );
    }
  }

  async initializeUpdateSetId(vatID: VatId) {
    this.setId(vatID);
  }
}
