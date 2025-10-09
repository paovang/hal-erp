import { Entity } from '@src/common/domain/entities/entity';
import { BudgetItemDetailId } from '../value-objects/budget-item-detail-rule-id.vo';
import { BudgetItemDetailBuilder } from '../builders/budget-item-detail.builder';
import { ProvinceEntity } from './province.entity';

export class BudgetItemDetailEntity extends Entity<BudgetItemDetailId> {
  private readonly _budgetItemId: number;
  private readonly _name: string;
  private readonly _provinceId: number;
  private readonly _description: string;
  private readonly _allocated_amount: number;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date | null;
  private readonly _deletedAt: Date | null;
  private readonly _province: ProvinceEntity | null;

  private constructor(builder: BudgetItemDetailBuilder) {
    super();
    this.setId(builder.budgetItemDetailId);
    this._name = builder.name;
    this._budgetItemId = builder.budgetItemId;
    this._description = builder.description;
    this._provinceId = builder.provinceId;
    this._allocated_amount = builder.allocated_amount;
    this._createdAt = builder.createdAt;
    this._updatedAt = builder.updatedAt ?? null;
    this._deletedAt = builder.deletedAt ?? null;
    this._province = builder.province ?? null;
  }

  get budgetItemId(): number {
    return this._budgetItemId;
  }

  get name(): string {
    return this._name;
  }

  get provinceId(): number {
    return this._provinceId;
  }

  get description(): string {
    return this._description;
  }

  get allocatedAmount(): number {
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

  get province(): ProvinceEntity | null {
    return this._province;
  }

  public static builder(): BudgetItemDetailBuilder {
    return new BudgetItemDetailBuilder();
  }

  static create(builder: BudgetItemDetailBuilder): BudgetItemDetailEntity {
    return new BudgetItemDetailEntity(builder);
  }

  static getEntityName() {
    return 'budget_item_detail';
  }

  async validateExistingIdForUpdate() {
    if (!this.getId()) {
      console.log('phoudvang');
      // throw new UserDomainException(
      //   'users.user_is_not_in_correct_state_for_initialization',
      // );
    }
  }

  async initializeUpdateSetId(budgetItemId: BudgetItemDetailId) {
    this.setId(budgetItemId);
  }
}
