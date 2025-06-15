import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { DocumentTypeOrmEntity } from './document-type.orm';
import { ApprovalWorkflowStepOrmEntity } from './approval-workflow-step.orm';
import { UserApprovalOrmEntity } from './user-approval.orm';

@Entity('approval_workflows')
export class ApprovalWorkflowOrmEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Index()
  @Column({ nullable: true })
  document_type_id?: number;
  @ManyToOne(
    () => DocumentTypeOrmEntity,
    (document_types) => document_types.approval_workflows,
  )
  @JoinColumn({ name: 'document_type_id' })
  document_types: Relation<DocumentTypeOrmEntity>;

  @Index()
  @Column({ type: 'varchar', nullable: true })
  name?: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;

  @OneToMany(
    () => ApprovalWorkflowStepOrmEntity,
    (approval_workflow_steps) => approval_workflow_steps.approval_workflows,
  )
  approval_workflow_steps: Relation<ApprovalWorkflowStepOrmEntity[]>;

  @OneToMany(
    () => UserApprovalOrmEntity,
    (user_approvals) => user_approvals.approval_workflows,
  )
  user_approvals: Relation<UserApprovalOrmEntity[]>;
}
