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
import { BudgetItemOrmEntity } from './budget-item.orm';
import { ProvinceOrmEntity } from './province.orm';
import { PurchaseOrderItemOrmEntity } from './purchase-order-item.orm';
import { DocumentTransactionOrmEntity } from './document-transaction.orm';

@Entity('budget_item_details')
export class BudgetItemDetailOrmEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Index()
  @Column({ nullable: true })
  budget_item_id?: number;
  @ManyToOne(
    () => BudgetItemOrmEntity,
    (budget_items) => budget_items.budget_item_details,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'budget_item_id' })
  budget_items: Relation<BudgetItemOrmEntity>;

  @Index()
  @Column({ nullable: true })
  province_id?: number;
  @ManyToOne(
    () => ProvinceOrmEntity,
    (provinces) => provinces.budget_item_details,
  )
  @JoinColumn({ name: 'province_id' })
  provinces: Relation<ProvinceOrmEntity>;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  name?: string;

  @Index()
  @Column({ type: 'double precision', nullable: true })
  allocated_amount?: number;

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
    () => PurchaseOrderItemOrmEntity,
    (purchase_order_items) => purchase_order_items.budget_item_details,
  )
  purchase_order_items: Relation<PurchaseOrderItemOrmEntity[]>;

  @OneToMany(
    () => DocumentTransactionOrmEntity,
    (document_transactions) => document_transactions.budget_item_details,
  )
  document_transactions: Relation<DocumentTransactionOrmEntity[]>;
}
