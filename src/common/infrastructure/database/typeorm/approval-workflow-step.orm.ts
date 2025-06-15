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
import { ApprovalWorkflowOrmEntity } from './approval-workflow.orm';
import { DepartmentOrmEntity } from './department.orm';
import { UserApprovalStepOrmEntity } from './user-approval-step.orm';

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
    (user_approval_steps) => user_approval_steps.approval_workflow_steps,
  )
  user_approval_steps: Relation<UserApprovalStepOrmEntity[]>;
}
