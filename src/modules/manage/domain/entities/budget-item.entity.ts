import { Entity } from '@src/common/domain/entities/entity';
import { BudgetItemBuilder } from '../builders/budget-item.builder';
import { BudgetItemId } from '../value-objects/budget-item-id.vo';
import { BudgetItemDetailEntity } from './budget-item-detail.entity';
import { BudgetAccountEntity } from './budget-account.entity';

export class BudgetItemEntity extends Entity<BudgetItemId> {
  private readonly _name: string;
  private readonly _budgetAccountId: number;
  private _allocatedAmount: number;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date | null;
  private readonly _deletedAt: Date | null;
  private readonly _details: BudgetItemDetailEntity[] | null;
  private readonly _count_details: number | null;
  private readonly _budget_account: BudgetAccountEntity | null;

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
    this._count_details = builder.count_details ?? null;
    this._budget_account = builder.budgetAccount ?? null;
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

  get budgetAccount(): BudgetAccountEntity | null {
    return this._budget_account;
  }

  get count_details(): number | null {
    return this._count_details;
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

  // ✅ Newly added method
  public setAllocatedAmount(amount: number): void {
    this._allocatedAmount = amount;
  }
}
