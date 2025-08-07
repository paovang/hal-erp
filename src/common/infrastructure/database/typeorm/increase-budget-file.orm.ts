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
import { IncreaseBudgetOrmEntity } from './Increase-budget.orm';

@Entity('increase_budget_files')
export class IncreaseBudgetFileOrmEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Index()
  @Column({ nullable: true })
  increase_budget_id?: number;
  @ManyToOne(
    () => IncreaseBudgetOrmEntity,
    (increase_budget) => increase_budget.increase_budget_files,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'increase_budget_id' })
  increase_budget: Relation<IncreaseBudgetOrmEntity>;

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
