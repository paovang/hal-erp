import { Entity } from '@src/common/domain/entities/entity';
import { IncreaseBudgetDetailId } from '../value-objects/increase-budget-detail-id.vo';
import { BadRequestException } from '@nestjs/common';
import { IncreaseBudgetDetailBuilder } from '../builders/increase-budget-detail.builder';

export class IncreaseBudgetDetailEntity extends Entity<IncreaseBudgetDetailId> {
  private readonly _budget_item_id: number;
  private readonly _allocated_amount: number;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date | null;
  private readonly _deletedAt: Date | null;

  private constructor(builder: IncreaseBudgetDetailBuilder) {
    super();
    this.setId(builder.increaseBudgetDetailId);
    this._budget_item_id = builder.budget_item_id;
    this._allocated_amount = builder.allocated_amount;
    this._createdAt = builder.createdAt;
    this._updatedAt = builder.updatedAt ?? null;
    this._deletedAt = builder.deletedAt ?? null;
  }

  get budget_item_id(): number {
    return this._budget_item_id;
  }

  get allocated_amount(): number {
    return this._allocated_amount;
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

  public static builder(): IncreaseBudgetDetailBuilder {
    return new IncreaseBudgetDetailBuilder();
  }

  static create(
    builder: IncreaseBudgetDetailBuilder,
  ): IncreaseBudgetDetailEntity {
    return new IncreaseBudgetDetailEntity(builder);
  }

  static getEntityName() {
    return 'IncreaseBudgetDetail';
  }

  async validateExistingIdForUpdate() {
    if (!this.getId()) {
      console.log('phoudvang');
      throw new BadRequestException(
        'users.user_is_not_in_correct_state_for_initialization',
      );
    }
  }

  async initializeUpdateSetId(increaseBudgetDetailID: IncreaseBudgetDetailId) {
    this.setId(increaseBudgetDetailID);
  }
}
