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
import { UserApprovalOrmEntity } from './user-approval.orm';
import { UserOrmEntity } from './user.orm';
import { DocumentStatusOrmEntity } from './document-statuse.orm';
import { DocumentApproverOrmEntity } from './document-approver.orm';

@Entity('user_approval_steps')
export class UserApprovalStepOrmEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Index()
  @Column({ nullable: true })
  user_approval_id?: number;
  @ManyToOne(
    () => UserApprovalOrmEntity,
    (user_approvals) => user_approvals.user_approval_steps,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'user_approval_id' })
  user_approvals: Relation<UserApprovalOrmEntity>;

  @Index()
  @Column({ type: 'integer', nullable: true })
  step_number?: number;

  @Index()
  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
  })
  requires_file_upload: boolean;

  @Index()
  @Column({ nullable: true })
  approver_id?: number;
  @ManyToOne(() => UserOrmEntity, (approver) => approver.user_approval_steps, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'approver_id' })
  approver: Relation<UserOrmEntity>;

  @Index()
  @Column({ type: 'timestamp', nullable: true })
  approved_at?: Date;

  @Index()
  @Column({ nullable: true })
  status_id?: number;
  @ManyToOne(
    () => DocumentStatusOrmEntity,
    (status) => status.user_approval_steps,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'status_id' })
  status: Relation<DocumentStatusOrmEntity>;

  @Column({ type: 'text', nullable: true })
  remark?: string;

  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
  })
  is_otp: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;

  @OneToMany(
    () => DocumentApproverOrmEntity,
    (document_approvers) => document_approvers.user_approval_steps,
  )
  document_approvers: Relation<DocumentApproverOrmEntity[]>;
}
