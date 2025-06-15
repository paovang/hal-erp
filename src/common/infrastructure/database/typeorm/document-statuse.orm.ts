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
import { UserApprovalOrmEntity } from './user-approval.orm';
import { UserApprovalStepOrmEntity } from './user-approval-step.orm';

@Entity('document_statuses')
export class DocumentStatusOrmEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
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
    () => UserApprovalOrmEntity,
    (user_approvals) => user_approvals.document_statuses,
  )
  user_approvals: Relation<UserApprovalOrmEntity[]>;

  @OneToMany(
    () => UserApprovalStepOrmEntity,
    (user_approval_steps) => user_approval_steps.document_statuses,
  )
  user_approval_steps: Relation<UserApprovalStepOrmEntity[]>;
}
