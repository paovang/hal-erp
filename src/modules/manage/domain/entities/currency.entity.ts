import { Entity } from '@src/common/domain/entities/entity';
import { CurrencyId } from '../value-objects/currency-id.vo';
import { CurrencyBuilder } from '../builders/currency.builder';

export class CurrencyEntity extends Entity<CurrencyId> {
  private readonly _code: string;
  private readonly _name: string;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date | null;
  private readonly _deletedAt: Date | null;

  private constructor(builder: CurrencyBuilder) {
    super();
    this.setId(builder.currencyId);
    this._code = builder.code;
    this._name = builder.name;
    this._createdAt = builder.createdAt;
    this._updatedAt = builder.updatedAt ?? null;
    this._deletedAt = builder.deletedAt ?? null;
  }

  get code(): string {
    return this._code;
  }

  get name(): string {
    return this._name;
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

  public static builder(): CurrencyBuilder {
    return new CurrencyBuilder();
  }

  static create(builder: CurrencyBuilder): CurrencyEntity {
    return new CurrencyEntity(builder);
  }

  static getEntityName() {
    return 'currency';
  }

  async validateExistingIdForUpdate() {
    if (!this.getId()) {
      console.log('phoudvang');
      // throw new UserDomainException(
      //   'users.user_is_not_in_correct_state_for_initialization',
      // );
    }
  }

  async initializeUpdateSetId(currencyId: CurrencyId) {
    this.setId(currencyId);
  }
}
