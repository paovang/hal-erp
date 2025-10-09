import { IncreaseBudgetOrmEntity } from './increase-budget.orm';
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

@Entity('increase_budget_files')
export class IncreaseBudgetFileOrmEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Index()
  @Column({ nullable: true })
  increase_budget_id?: number;
  @ManyToOne(
    () => IncreaseBudgetOrmEntity,
    (increase_budgets) => increase_budgets.increase_budget_files,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'increase_budget_id' })
  increase_budgets: Relation<IncreaseBudgetOrmEntity>;

  @Column({ type: 'varchar', length: 255, nullable: true })
  file_name?: string;

  @Column()
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;
}
