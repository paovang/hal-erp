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
import { BudgetAccountOrmEntity } from './budget-account.orm';

@Entity('sub_budget_accounts')
export class SubBudgetAccountOrmEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Index()
  @Column({ nullable: true })
  budget_account_id?: number;
  @ManyToOne(
    () => BudgetAccountOrmEntity,
    (budget_accounts) => budget_accounts.sub_budget_accounts,
  )
  @JoinColumn({ name: 'budget_account_id' })
  budget_accounts: Relation<BudgetAccountOrmEntity>;

  @Index()
  @Column({ type: 'varchar', length: 255, unique: true })
  code: string;

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
}
