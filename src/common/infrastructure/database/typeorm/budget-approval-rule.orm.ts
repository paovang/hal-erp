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
import { DepartmentOrmEntity } from './department.orm';
import { UserOrmEntity } from './user.orm';

@Entity('budget_approval_rules')
export class BudgetApprovalRuleOrmEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Index()
  @Column({ nullable: true })
  department_id?: number;
  @ManyToOne(
    () => DepartmentOrmEntity,
    (departments) => departments.budget_approval_rules,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'department_id' })
  departments: Relation<DepartmentOrmEntity>;

  @Index()
  @Column({ nullable: true })
  approver_id?: number;
  @ManyToOne(() => UserOrmEntity, (users) => users.budget_approval_rules, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'approver_id' })
  users: Relation<UserOrmEntity>;

  @Index()
  @Column({ type: 'double precision', nullable: true })
  min_amount?: number;

  @Index()
  @Column({ type: 'double precision', nullable: true })
  max_amount?: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;
}
