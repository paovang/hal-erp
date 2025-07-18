import { Entity } from '@src/common/domain/entities/entity';
import { BadRequestException } from '@nestjs/common';
import { VatId } from '../value-objects/vat-id.vo';
import { ExchangeRateId } from '../value-objects/exchange-rate-id.vo';
import { ExchangeRateBuilder } from '../builders/exchage-rate.builder';

export class ExchangeRateEntity extends Entity<ExchangeRateId> {
  private readonly _from_currency: number;
  private readonly _to_currency: number;
  private readonly _rate: number;
  private readonly _is_active: boolean;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date | null;
  private readonly _deletedAt: Date | null;

  private constructor(builder: ExchangeRateBuilder) {
    super();
    this.setId(builder.exchangeRateId);
    this._from_currency = builder.from_currency;
    this._to_currency = builder.to_currency;
    this._rate = builder.rate;
    this._is_active = builder.is_active;
    this._updatedAt = builder.updatedAt ?? null;
    this._deletedAt = builder.deletedAt ?? null;
  }

  get from_currency(): number {
    return this._from_currency;
  }
  get to_currency(): number {
    return this._to_currency;
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
