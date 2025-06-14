import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { DepartmentUserOrmEntity } from './department-user.orm';
import { DepartmentApproverOrmEntity } from './department-approver.orm';
import { RoleOrmEntity } from './role.orm';
import { BudgetApprovalRuleOrmEntity } from './budget-approval-rule.orm';
import { UserHasPermissionOrmEntity } from './model-has-permission.orm';
import { DocumentOrmEntity } from './document.orm';
import { UserSignatureOrmEntity } from './user-signature.orm';

@Entity('users')
export class UserOrmEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  username?: string;

  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  email?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password?: string;

  @Column({ type: 'varchar', length: 191, nullable: true, unique: true })
  tel?: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;

  // @OneToMany(
  // () => UserApprovalStepEntity,
  //     (user_approval_steps) => user_approval_steps.users,
  // )
  // user_approval_steps: Relation<UserApprovalStepEntity[]>;

  @OneToMany(
    () => BudgetApprovalRuleOrmEntity,
    (budget_approval_rules) => budget_approval_rules.users,
  )
  budget_approval_rules: Relation<BudgetApprovalRuleOrmEntity[]>;

  @OneToMany(
    () => DepartmentApproverOrmEntity,
    (department_approvers) => department_approvers.users,
  )
  department_approvers: Relation<DepartmentApproverOrmEntity[]>;

  @OneToMany(
    () => DepartmentUserOrmEntity,
    (department_users) => department_users.users,
  )
  department_users: Relation<DepartmentUserOrmEntity[]>;

  @OneToMany(
    () => DepartmentUserOrmEntity,
    (line_manager) => line_manager.users,
  )
  line_manager: Relation<DepartmentUserOrmEntity[]>;

  // @OneToMany(
  // () => DocumentAttachmentEntity,
  //     (document_attachments) => document_attachments.users,
  // )
  // document_attachments: Relation<DocumentAttachmentEntity[]>;

  @OneToMany(() => DocumentOrmEntity, (documents) => documents.users)
  documents: Relation<DocumentOrmEntity[]>;

  @ManyToMany(() => RoleOrmEntity, (role) => role.users, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinTable({
    name: 'user_has_roles',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles: Relation<RoleOrmEntity[]>;

  @OneToMany(
    () => UserHasPermissionOrmEntity,
    (userHasPermission) => userHasPermission.user,
  )
  userHasPermissions: Relation<UserHasPermissionOrmEntity[]>;

  @OneToMany(
    () => UserSignatureOrmEntity,
    (user_signatures) => user_signatures.users,
  )
  user_signatures: Relation<UserSignatureOrmEntity[]>;
}
