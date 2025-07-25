import { Entity } from '@src/common/domain/entities/entity';
import { BankId } from '../value-objects/bank-id.vo';
import { BankBuilder } from '../builders/bank.builder';

export class BankEntity extends Entity<BankId> {
  private readonly _short_name: string;
  private readonly _name: string;
  private readonly _logo: any;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date | null;
  private readonly _deletedAt: Date | null;

  private constructor(builder: BankBuilder) {
    super();
    this.setId(builder.BankId);
    this._short_name = builder.short_name;
    this._name = builder.name;
    this._logo = builder.logo;
    this._createdAt = builder.createdAt;
    this._updatedAt = builder.updatedAt ?? null;
    this._deletedAt = builder.deletedAt ?? null;
  }

  get short_name(): string {
    return this._short_name;
  }

  get name(): string {
    return this._name;
  }
  get logo(): any {
    return this._logo;
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

  public static builder(): BankBuilder {
    return new BankBuilder();
  }

  static create(builder: BankBuilder): BankEntity {
    return new BankEntity(builder);
  }

  static getEntityName() {
    return 'banks';
  }

  async validateExistingIdForUpdate() {
    if (!this.getId()) {
      // throw new UserDomainException(
      //   'users.user_is_not_in_correct_state_for_initialization',
      // );
    }
  }

  async initializeUpdateSetId(bankId: BankId) {
    this.setId(bankId);
  }
}
