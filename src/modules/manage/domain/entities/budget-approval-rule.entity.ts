import { Entity } from '@src/common/domain/entities/entity';
import { BudgetApprovalRuleId } from '../value-objects/budget-approval-rule-id.vo';
import { BudgetApprovalRuleBuilder } from '../builders/budget-approval-rule.builder';
import { DepartmentEntity } from './department.entity';
import { UserEntity } from './user.entity';

export class BudgetApprovalRuleEntity extends Entity<BudgetApprovalRuleId> {
  private readonly _departmentID: number;
  private readonly _approverID: number;
  private readonly _minAmount: number;
  private readonly _maxAmount: number;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date | null;
  private readonly _deletedAt: Date | null;
  private readonly _department: DepartmentEntity;
  private readonly _user: UserEntity;

  private constructor(builder: BudgetApprovalRuleBuilder) {
    super();
    this.setId(builder.budgetApprovalRuleId);
    this._departmentID = builder.department_id;
    this._approverID = builder.approver_id;
    this._minAmount = builder.min_amount;
    this._maxAmount = builder.max_amount;
    this._createdAt = builder.createdAt;
    this._updatedAt = builder.updatedAt ?? null;
    this._deletedAt = builder.deletedAt ?? null;
    this._department = builder.department;
    this._user = builder.user;
  }

  get departmentID(): number {
    return this._departmentID;
  }

  get approverID(): number {
    return this._approverID;
  }

  get minAmount(): number {
    return this._minAmount;
  }

  get maxAmount(): number {
    return this._maxAmount;
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

  get department(): DepartmentEntity {
    return this._department;
  }

  get user(): UserEntity {
    return this._user;
  }

  public static builder(): BudgetApprovalRuleBuilder {
    return new BudgetApprovalRuleBuilder();
  }

  static create(builder: BudgetApprovalRuleBuilder): BudgetApprovalRuleEntity {
    return new BudgetApprovalRuleEntity(builder);
  }

  static getEntityName() {
    return 'category';
  }

  async validateExistingIdForUpdate() {
    if (!this.getId()) {
      console.log('phoudvang');
      // throw new UserDomainException(
      //   'users.user_is_not_in_correct_state_for_initialization',
      // );
    }
  }

  async initializeUpdateSetId(budgetApprovalRuleId: BudgetApprovalRuleId) {
    this.setId(budgetApprovalRuleId);
  }
}
