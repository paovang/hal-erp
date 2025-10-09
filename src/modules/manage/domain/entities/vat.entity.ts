import { Entity } from '@src/common/domain/entities/entity';
import { BadRequestException } from '@nestjs/common';
import { VatId } from '../value-objects/vat-id.vo';
import { VatBuilder } from '../builders/vat.builder';

export class VatEntity extends Entity<VatId> {
  private readonly _amount: number;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date | null;
  private readonly _deletedAt: Date | null;

  private constructor(builder: VatBuilder) {
    super();
    this.setId(builder.vatId);
    this._amount = builder.amount;
    this._createdAt = builder.createdAt;
    this._updatedAt = builder.updatedAt ?? null;
    this._deletedAt = builder.deletedAt ?? null;
  }

  get amount(): number {
    return this._amount;
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

  public static builder(): VatBuilder {
    return new VatBuilder();
  }

  static create(builder: VatBuilder): VatEntity {
    return new VatEntity(builder);
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
