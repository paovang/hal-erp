import { Entity } from '@src/common/domain/entities/entity';
import { BudgetAccountBuilder } from '../builders/budget-account.builder';
import { BudgetAccountId } from '../value-objects/budget-account-id.vo';
import { DepartmentEntity } from './department.entity';
import { EnumBudgetType } from '../../application/constants/status-key.const';

export class BudgetAccountEntity extends Entity<BudgetAccountId> {
  private readonly _code: string;
  private readonly _name: string;
  private readonly _departmentId: number;
  private readonly _fiscal_year: number;
  // private readonly _allocated_amount: number;
  private readonly _type: EnumBudgetType;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date | null;
  private readonly _deletedAt: Date | null;
  private readonly _department: DepartmentEntity | null;

  private constructor(builder: BudgetAccountBuilder) {
    super();
    this.setId(builder.budgetAccountId);
    this._code = builder.code;
    this._name = builder.name;
    this._departmentId = builder.departmentId;
    this._fiscal_year = builder.fiscal_year;
    // this._allocated_amount = builder.allocated_amount;
    this._type = builder.type;
    this._createdAt = builder.createdAt;
    this._updatedAt = builder.updatedAt ?? null;
    this._deletedAt = builder.deletedAt ?? null;
    this._department = builder.department ?? null;
  }

  get code(): string {
    return this._code;
  }

  get name(): string {
    return this._name;
  }

  get departmentId(): number {
    return this._departmentId;
  }

  get fiscal_year(): number {
    return this._fiscal_year;
  }

  // get allocated_amount(): number {
  //   return this._allocated_amount;
  // }

  get type(): EnumBudgetType {
    return this._type;
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

  get department(): DepartmentEntity | null {
    return this._department;
  }

  public static builder(): BudgetAccountBuilder {
    return new BudgetAccountBuilder();
  }

  static create(builder: BudgetAccountBuilder): BudgetAccountEntity {
    return new BudgetAccountEntity(builder);
  }

  static getEntityName() {
    return 'budget_account';
  }

  async validateExistingIdForUpdate() {
    if (!this.getId()) {
      console.log('phoudvang');
      // throw new UserDomainException(
      //   'users.user_is_not_in_correct_state_for_initialization',
      // );
    }
  }

  async initializeUpdateSetId(budgetAccountId: BudgetAccountId) {
    this.setId(budgetAccountId);
  }
}
