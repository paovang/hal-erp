import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { ApprovalWorkflowOrmEntity } from './approval-workflow.orm';
import { DepartmentOrmEntity } from './department.orm';
import { EnumWorkflowStep } from '@src/modules/manage/application/constants/status-key.const';
import { UserOrmEntity } from './user.orm';

@Entity('approval_workflow_steps')
export class ApprovalWorkflowStepOrmEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Index()
  @Column({ nullable: true })
  approval_workflow_id?: number;
  @ManyToOne(
    () => ApprovalWorkflowOrmEntity,
    (approval_workflows) => approval_workflows.approval_workflow_steps,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'approval_workflow_id' })
  approval_workflows: Relation<ApprovalWorkflowOrmEntity>;

  @Index()
  @Column({ type: 'varchar', nullable: true })
  step_name?: string;

  @Index()
  @Column({ type: 'integer', nullable: true })
  step_number?: number;

  @Index()
  @Column({
    type: 'enum',
    enum: EnumWorkflowStep,
    nullable: true,
    default: EnumWorkflowStep.DEPARTMENT,
  })
  type?: EnumWorkflowStep;

  @Index()
  @Column({ nullable: true })
  department_id?: number;
  @ManyToOne(
    () => DepartmentOrmEntity,
    (departments) => departments.approval_workflow_steps,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'department_id' })
  departments: Relation<DepartmentOrmEntity>;

  @Index()
  @Column({ nullable: true })
  user_id?: number;
  @ManyToOne(() => UserOrmEntity, (users) => users.approval_workflow_steps, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  users: Relation<UserOrmEntity>;

  @Index()
  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
  })
  requires_file_upload: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;
}
