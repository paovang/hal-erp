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
import { PurchaseOrderOrmEntity } from './purchase-order.orm';
import { PurchaseRequestItemOrmEntity } from './purchase-request-item.orm';
import { BudgetItemDetailOrmEntity } from './budget-item-detail.orm';
import { PurchaseOrderItemQuoteOrmEntity } from './purchase-order-item-quote.orm';

@Entity('purchase_order_items')
export class PurchaseOrderItemOrmEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Index()
  @Column({ nullable: true })
  purchase_order_id?: number;
  @ManyToOne(
    () => PurchaseOrderOrmEntity,
    (purchase_orders) => purchase_orders.purchase_order_items,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'purchase_order_id' })
  purchase_orders: Relation<PurchaseOrderOrmEntity>;

  @Index()
  @Column({ nullable: true })
  purchase_request_item_id?: number;
  @ManyToOne(
    () => PurchaseRequestItemOrmEntity,
    (purchase_request_items) => purchase_request_items.purchase_order_items,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'purchase_request_item_id' })
  purchase_request_items: Relation<PurchaseRequestItemOrmEntity>;

  @Index()
  @Column({ nullable: true })
  budget_item_detail_id?: number;
  @ManyToOne(
    () => BudgetItemDetailOrmEntity,
    (budget_item_details) => budget_item_details.purchase_order_items,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'budget_item_detail_id' })
  budget_item_details: Relation<BudgetItemDetailOrmEntity>;

  @Index()
  @Column({ type: 'text', nullable: true })
  remark?: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;

  @OneToMany(
    () => PurchaseOrderItemQuoteOrmEntity,
    (purchase_order_item_quotes) =>
      purchase_order_item_quotes.purchase_order_items,
  )
  purchase_order_item_quotes: Relation<PurchaseOrderItemQuoteOrmEntity[]>;
}
