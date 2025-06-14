import { Entity } from '@src/common/domain/entities/entity';
import { PurchaseRequestId } from '../value-objects/purchase-request-id.vo';
import { PurchaseRequestBuilder } from '../builders/purchase-request.builder';
import { BadRequestException } from '@nestjs/common';

export class PurchaseRequestEntity extends Entity<PurchaseRequestId> {
  private readonly _name: string;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date | null;
  private readonly _deletedAt: Date | null;

  private constructor(builder: PurchaseRequestBuilder) {
    super();
    this.setId(builder.purchaseRequestId);
    this._name = builder.name;
    this._createdAt = builder.createdAt;
    this._updatedAt = builder.updatedAt ?? null;
    this._deletedAt = builder.deletedAt ?? null;
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

  public static builder(): PurchaseRequestBuilder {
    return new PurchaseRequestBuilder();
  }

  static create(builder: PurchaseRequestBuilder): PurchaseRequestEntity {
    return new PurchaseRequestEntity(builder);
  }

  static getEntityName() {
    return 'PurchaseRequest';
  }

  async validateExistingIdForUpdate() {
    if (!this.getId()) {
      console.log('phoudvang');
      throw new BadRequestException(
        'users.user_is_not_in_correct_state_for_initialization',
      );
    }
  }

  async initializeUpdateSetId(purchaseRequestID: PurchaseRequestId) {
    this.setId(purchaseRequestID);
  }
}
