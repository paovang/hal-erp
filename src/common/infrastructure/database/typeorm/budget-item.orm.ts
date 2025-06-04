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
import { BudgetAccountOrmEntity } from './budget-account.orm';
import { BudgetItemDetailOrmEntity } from './budget-item-detail.orm';

@Entity('budget_items')
export class BudgetItemOrmEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Index()
  @Column({ nullable: true })
  budget_account_id?: number;
  @ManyToOne(
    () => BudgetAccountOrmEntity,
    (budget_accounts) => budget_accounts.budget_items,
  )
  @JoinColumn({ name: 'budget_account_id' })
  budget_accounts: Relation<BudgetAccountOrmEntity>;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  name?: string;

  @Index()
  @Column({ type: 'double precision', nullable: true })
  allocated_amount?: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;

  @OneToMany(
    () => BudgetItemDetailOrmEntity,
    (budget_item_details) => budget_item_details.budget_items,
  )
  budget_item_details: Relation<BudgetItemDetailOrmEntity[]>;
}
