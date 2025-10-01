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
import { BudgetItemOrmEntity } from './budget-item.orm';
import { IncreaseBudgetOrmEntity } from './increase-budget.orm';

@Entity('increase_budget_details')
export class IncreaseBudgetDetailOrmEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Index()
  @Column({ nullable: true })
  budget_item_id?: number;
  @ManyToOne(
    () => BudgetItemOrmEntity,
    (budget_item) => budget_item.increase_budget_detail,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'budget_item_id' })
  budget_item: Relation<BudgetItemOrmEntity>;

  @Index()
  @Column({ nullable: true })
  increase_budget_id?: number;
  @ManyToOne(
    () => IncreaseBudgetOrmEntity,
    (increase_budgets) => increase_budgets.increase_budget_details,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'increase_budget_id' })
  increase_budgets: Relation<IncreaseBudgetOrmEntity>;

  @Index()
  @Column({ type: 'decimal', precision: 15, scale: 8, nullable: true })
  allocated_amount?: number;

  @Column()
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;
}
