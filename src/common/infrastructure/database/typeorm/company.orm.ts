import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { PositionOrmEntity } from './position.orm';
import { ApprovalWorkflowOrmEntity } from './approval-workflow.orm';
import { DepartmentOrmEntity } from './department.orm';
import { DepartmentApproverOrmEntity } from './department-approver.orm';
import { DepartmentUserOrmEntity } from './department-user.orm';
import { BudgetAccountOrmEntity } from './budget-account.orm';
import { BudgetApprovalRuleOrmEntity } from './budget-approval-rule.orm';
import { DocumentOrmEntity } from './document.orm';
import { CompanyUserOrmEntity } from './company-user.orm';

@Entity('companies')
export class CompanyOrmEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  name?: string;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  logo?: string;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  tel?: string;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  email?: string;

  @Index()
  @Column({ type: 'text', nullable: true })
  address?: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;

  @OneToMany(() => PositionOrmEntity, (position) => position.company)
  positions: Relation<PositionOrmEntity[]>;

  @OneToMany(
    () => ApprovalWorkflowOrmEntity,
    (approval_workflows) => approval_workflows.company,
  )
  approval_workflows: Relation<ApprovalWorkflowOrmEntity[]>;

  @OneToMany(() => DepartmentOrmEntity, (department) => department.company)
  departments: Relation<DepartmentOrmEntity[]>;

  @OneToMany(
    () => DepartmentApproverOrmEntity,
    (department_approvers) => department_approvers.company,
  )
  department_approvers: Relation<DepartmentApproverOrmEntity[]>;

  @OneToMany(
    () => DepartmentUserOrmEntity,
    (department_users) => department_users.company,
  )
  department_users: Relation<DepartmentUserOrmEntity[]>;

  @OneToMany(
    () => BudgetAccountOrmEntity,
    (budget_accounts) => budget_accounts.company,
  )
  budget_accounts: Relation<BudgetAccountOrmEntity[]>;

  @OneToMany(
    () => BudgetApprovalRuleOrmEntity,
    (budget_approval_rules) => budget_approval_rules.company,
  )
  budget_approval_rules: Relation<BudgetApprovalRuleOrmEntity[]>;

  @OneToMany(() => DocumentOrmEntity, (documents) => documents.company)
  documents: Relation<DocumentOrmEntity[]>;

  @OneToMany(
    () => CompanyUserOrmEntity,
    (company_users) => company_users.company,
  )
  company_users: Relation<CompanyUserOrmEntity[]>;
}
