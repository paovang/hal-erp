import { BudgetApprovalRuleEntity } from '../entities/budget-approval-rule.entity';
import { DepartmentEntity } from '../entities/department.entity';
import { UserEntity } from '../entities/user.entity';
import { BudgetApprovalRuleId } from '../value-objects/budget-approval-rule-id.vo';
export class BudgetApprovalRuleBuilder {
  budgetApprovalRuleId: BudgetApprovalRuleId;
  department_id: number;
  approver_id: number;
  min_amount: number;
  max_amount: number;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;
  department: DepartmentEntity;
  user: UserEntity;
  setBudgetApprovalRuleId(value: BudgetApprovalRuleId): this {
    this.budgetApprovalRuleId = value;
    return this;
  }

  setDepartmentId(department_id: number): this {
    this.department_id = department_id;
    return this;
  }

  setApproverId(approver_id: number): this {
    this.approver_id = approver_id;
    return this;
  }

  setMinAmount(min_amount: number): this {
    this.min_amount = min_amount;
    return this;
  }

  setMaxAmount(max_amount: number): this {
    this.max_amount = max_amount;
    return this;
  }

  setCreatedAt(createdAt: Date): this {
    this.createdAt = createdAt;
    return this;
  }

  setUpdatedAt(updatedAt: Date | null): this {
    this.updatedAt = updatedAt;
    return this;
  }

  setDeletedAt(deletedAt: Date | null): this {
    this.deletedAt = deletedAt;
    return this;
  }

  setDepartment(department: DepartmentEntity): this {
    this.department = department;
    return this;
  }

  setUser(user: UserEntity): this {
    this.user = user;
    return this;
  }

  build(): BudgetApprovalRuleEntity {
    return BudgetApprovalRuleEntity.create(this);
  }
}
