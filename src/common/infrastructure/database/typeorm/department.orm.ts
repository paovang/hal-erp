import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  DeleteDateColumn,
  OneToMany,
  Relation,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DepartmentUserOrmEntity } from './department-user.orm';
import { DepartmentApproverOrmEntity } from './department-approver.orm';
import { BudgetApprovalRuleOrmEntity } from './budget-approval-rule.orm';
import { BudgetAccountOrmEntity } from './budget-account.orm';
import { DocumentOrmEntity } from './document.orm';
import { ApprovalWorkflowStepOrmEntity } from './approval-workflow-step.orm';
import { UserOrmEntity } from './user.orm';
import { RoleGroupOrmEntity } from './role-group.orm';
// import { BudgetAccountOrmEntity } from './budget-account.orm';

@Entity('departments')
export class DepartmentOrmEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Index()
  @Column({ type: 'varchar', length: 255, unique: true })
  code: string;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Index()
  @Column({ type: 'boolean', default: false })
  is_line_manager: boolean;

  @Index()
  @Column({ nullable: true })
  department_head_id?: number;
  @ManyToOne(() => UserOrmEntity, (users) => users.departments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'department_head_id' })
  users: Relation<UserOrmEntity>;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;

  @OneToMany(
    () => DepartmentUserOrmEntity,
    (department_users) => department_users.departments,
  )
  department_users: Relation<DepartmentUserOrmEntity[]>;

  @OneToMany(
    () => DepartmentApproverOrmEntity,
    (department_approvers) => department_approvers.departments,
  )
  department_approvers: Relation<DepartmentApproverOrmEntity[]>;

  @OneToMany(
    () => BudgetAccountOrmEntity,
    (budget_accounts) => budget_accounts.departments,
  )
  budget_accounts: Relation<BudgetAccountOrmEntity[]>;

  @OneToMany(
    () => BudgetApprovalRuleOrmEntity,
    (budget_approval_rules) => budget_approval_rules.departments,
  )
  budget_approval_rules: Relation<BudgetApprovalRuleOrmEntity[]>;

  @OneToMany(() => DocumentOrmEntity, (documents) => documents.departments)
  documents: Relation<DocumentOrmEntity[]>;

  @OneToMany(
    () => ApprovalWorkflowStepOrmEntity,
    (approval_workflow_steps) => approval_workflow_steps.departments,
  )
  approval_workflow_steps: Relation<ApprovalWorkflowStepOrmEntity[]>;

  @OneToMany(() => RoleGroupOrmEntity, (roleGroup) => roleGroup.department)
  rolesGroups: Relation<RoleGroupOrmEntity[]>;
}
