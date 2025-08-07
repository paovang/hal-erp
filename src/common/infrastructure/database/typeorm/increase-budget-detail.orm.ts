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

@Entity('increase_budget_details')
export class IncreaseBudgetDetailOrmEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Index()
  @Column({ nullable: true })
  increase_budget_id?: number;
  @ManyToOne(
    () => BudgetItemOrmEntity,
    (budget_item) => budget_item.increase_budget_detail,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'increase_budget_id' })
  budget_item: Relation<BudgetItemOrmEntity>;

  @Index()
  @Column({ type: 'double precision', nullable: true })
  allocated_amount?: number;

  @Column()
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;
}
