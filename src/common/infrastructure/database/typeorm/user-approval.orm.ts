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
import { DocumentOrmEntity } from './document.orm';
import { ApprovalWorkflowOrmEntity } from './approval-workflow.orm';
import { DocumentStatusOrmEntity } from './document-statuse.orm';
import { UserApprovalStepOrmEntity } from './user-approval-step.orm';

@Entity('user_approvals')
export class UserApprovalOrmEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Index()
  @Column({ nullable: true })
  document_id?: number;
  @ManyToOne(() => DocumentOrmEntity, (documents) => documents.user_approvals, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'document_id' })
  documents: Relation<DocumentOrmEntity>;

  @Index()
  @Column({ nullable: true })
  approval_workflow_id?: number;
  @ManyToOne(
    () => ApprovalWorkflowOrmEntity,
    (approval_workflows) => approval_workflows.user_approvals,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'approval_workflow_id' })
  approval_workflows: Relation<ApprovalWorkflowOrmEntity>;

  @Index()
  @Column({ nullable: true })
  status_id?: number;
  @ManyToOne(
    () => DocumentStatusOrmEntity,
    (document_statuses) => document_statuses.user_approvals,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'status_id' })
  document_statuses: Relation<DocumentStatusOrmEntity>;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;

  @OneToMany(
    () => UserApprovalStepOrmEntity,
    (user_approval_steps) => user_approval_steps.user_approvals,
  )
  user_approval_steps: Relation<UserApprovalStepOrmEntity[]>;
}
