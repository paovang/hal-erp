import { Entity } from '@src/common/domain/entities/entity';
import { IncreaseBudgetId } from '../value-objects/increase-budget-id.vo';
import { IncreaseBudgetBuilder } from '../builders/increase-budget.builder';
import { UserEntity } from './user.entity';
import { BudgetAccountEntity } from './budget-account.entity';
import { IncreaseBudgetFileEntity } from './increase-budget-file.entity';

export class IncreaseBudgetEntity extends Entity<IncreaseBudgetId> {
  private readonly _budget_account_id: number;
  private readonly _allocated_amount: number;
  private readonly _description: string;
  private readonly _import_date: Date | null;
  private readonly _created_by: number;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date | null;
  private readonly _deletedAt: Date | null;
  private readonly _budget_account: BudgetAccountEntity | null;
  private readonly _increase_budget_file: IncreaseBudgetFileEntity[] | null;
  private readonly _created_by_user: UserEntity | null;

  private constructor(builder: IncreaseBudgetBuilder) {
    super();
    this.setId(builder.increaseBudgetId);
    this._budget_account_id = builder.budget_account_id;
    this._allocated_amount = builder.allocated_amount;
    this._description = builder.description;
    this._import_date = builder.import_date;
    this._created_by = builder.created_by;
    this._createdAt = builder.createdAt;
    this._updatedAt = builder.updatedAt ?? null;
    this._deletedAt = builder.deletedAt ?? null;
    this._budget_account = builder.budget_account ?? null;
    this._created_by_user = builder.created_by_user ?? null;
    this._increase_budget_file = builder.increase_budget_file ?? null;
  }

  get budget_account_id(): number {
    return this._budget_account_id;
  }

  get allocated_amount(): number {
    return this._allocated_amount;
  }

  get description(): string {
    return this._description;
  }

  get import_date(): Date | null {
    return this._import_date;
  }

  get created_by(): number {
    return this._created_by;
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

  get budget_account(): BudgetAccountEntity | null {
    return this._budget_account;
  }

  get increase_budget_file(): IncreaseBudgetFileEntity[] | null {
    return this._increase_budget_file;
  }

  get created_by_user(): UserEntity | null {
    return this._created_by_user;
  }

  public static builder(): IncreaseBudgetBuilder {
    return new IncreaseBudgetBuilder();
  }

  static create(builder: IncreaseBudgetBuilder): IncreaseBudgetEntity {
    return new IncreaseBudgetEntity(builder);
  }

  static getEntityName() {
    return 'IncreaseBudgetEntity';
  }

  async validateExistingIdForUpdate() {
    if (!this.getId()) {
      console.log('phoudvang');
      // throw new UserDomainException(
      //   'users.user_is_not_in_correct_state_for_initialization',
      // );
    }
  }

  async initializeUpdateSetId(IncreaseBudgetId: IncreaseBudgetId) {
    this.setId(IncreaseBudgetId);
  }
}
