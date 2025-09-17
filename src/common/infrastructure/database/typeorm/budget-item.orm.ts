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
import { DocumentTransactionOrmEntity } from './document-transaction.orm';
import { PurchaseOrderItemOrmEntity } from './purchase-order-item.orm';
import { IncreaseBudgetDetailOrmEntity } from './increase-budget-detail.orm';

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
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'budget_account_id' })
  budget_accounts: Relation<BudgetAccountOrmEntity>;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  name?: string;

  // @Index()
  // @Column({ type: 'double precision', nullable: true })
  // allocated_amount?: number;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;

  @OneToMany(
    () => DocumentTransactionOrmEntity,
    (document_transactions) => document_transactions.budget_items,
  )
  document_transactions: Relation<DocumentTransactionOrmEntity[]>;

  @OneToMany(
    () => PurchaseOrderItemOrmEntity,
    (purchase_order_item) => purchase_order_item.budget_item,
  )
  purchase_order_item: Relation<PurchaseOrderItemOrmEntity[]>;

  @OneToMany(
    () => IncreaseBudgetDetailOrmEntity,
    (increase_budget_detail) => increase_budget_detail.budget_item,
  )
  increase_budget_detail: Relation<IncreaseBudgetDetailOrmEntity[]>;
}
