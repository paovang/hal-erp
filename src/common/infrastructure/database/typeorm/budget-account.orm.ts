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
import { DepartmentOrmEntity } from './department.orm';
import { BudgetItemOrmEntity } from './budget-item.orm';
import { EnumBudgetType } from '@src/modules/manage/application/constants/status-key.const';

@Entity('budget_accounts')
export class BudgetAccountOrmEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Index()
  @Column({ type: 'varchar', length: 255, unique: true })
  code: string;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  name?: string;

  @Index()
  @Column({ type: 'integer', nullable: true })
  fiscal_year?: number;

  @Index()
  @Column({ type: 'double precision', nullable: true })
  allocated_amount?: number;

  @Index()
  @Column({ nullable: true })
  department_id?: number;
  @ManyToOne(
    () => DepartmentOrmEntity,
    (departments) => departments.budget_accounts,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'department_id' })
  departments: Relation<DepartmentOrmEntity>;

  @Index()
  @Column({ type: 'enum', enum: EnumBudgetType, nullable: true })
  type?: EnumBudgetType;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;

  @OneToMany(
    () => BudgetItemOrmEntity,
    (budget_items) => budget_items.budget_accounts,
  )
  budget_items: Relation<BudgetItemOrmEntity[]>;
}
