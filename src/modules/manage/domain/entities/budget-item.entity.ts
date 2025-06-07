import { Entity } from '@src/common/domain/entities/entity';
import { BudgetItemBuilder } from '../builders/budget-item.builder';
import { BudgetItemId } from '../value-objects/budget-item-id.vo';
import { BudgetItemDetailEntity } from './budget-item-detail.entity';

export class BudgetItemEntity extends Entity<BudgetItemId> {
  private readonly _name: string;
  private readonly _budgetAccountId: number;
  private readonly _allocatedAmount: number;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date | null;
  private readonly _deletedAt: Date | null;
  private readonly _details: BudgetItemDetailEntity[] | null;

  private constructor(builder: BudgetItemBuilder) {
    super();
    this.setId(builder.budgetItemId);
    this._name = builder.name;
    this._budgetAccountId = builder.budgetAccountId;
    this._allocatedAmount = builder.allocated_amount;
    this._createdAt = builder.createdAt;
    this._updatedAt = builder.updatedAt ?? null;
    this._deletedAt = builder.deletedAt ?? null;
    this._details = builder.details ?? null;
  }

  get budgetAccountId(): number {
    return this._budgetAccountId;
  }
  get name(): string {
    return this._name;
  }

  get allocatedAmount(): number {
    return this._allocatedAmount;
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

  get details(): BudgetItemDetailEntity[] | null {
    return this._details;
  }

  public static builder(): BudgetItemBuilder {
    return new BudgetItemBuilder();
  }

  static create(builder: BudgetItemBuilder): BudgetItemEntity {
    return new BudgetItemEntity(builder);
  }

  static getEntityName() {
    return 'budget_item';
  }

  async validateExistingIdForUpdate() {
    if (!this.getId()) {
      console.log('phoudvang');
      // throw new UserDomainException(
      //   'users.user_is_not_in_correct_state_for_initialization',
      // );
    }
  }

  async initializeUpdateSetId(budgetItemId: BudgetItemId) {
    this.setId(budgetItemId);
  }
}
