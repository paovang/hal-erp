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
import { SelectStatus } from '@src/modules/manage/application/constants/status-key.const';
import { PurchaseOrderSelectedVendorOrmEntity } from './purchase-order-selected-vendor.orm';
import { ReceiptItemOrmEntity } from './receipt.item.orm';
import { BudgetItemOrmEntity } from './budget-item.orm';

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
  budget_item_id?: number;
  @ManyToOne(
    () => BudgetItemOrmEntity,
    (budget_item) => budget_item.purchase_order_item,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'budget_item_id' })
  budget_item: Relation<BudgetItemOrmEntity>;

  @Index()
  @Column({ type: 'integer', nullable: true })
  quantity?: number;

  @Index()
  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  price?: number;

  @Index()
  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  total?: number;

  @Index()
  @Column({ type: 'text', nullable: true })
  remark?: string;

  @Column({
    type: 'enum',
    enum: SelectStatus,
    nullable: true,
    default: SelectStatus.TRUE,
  })
  is_vat?: SelectStatus;

  @Column({ type: 'decimal', precision: 15, scale: 8, nullable: true })
  vat?: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;

  @OneToMany(
    () => PurchaseOrderSelectedVendorOrmEntity,
    (purchase_order_selected_vendors) =>
      purchase_order_selected_vendors.purchase_order_items,
  )
  purchase_order_selected_vendors: Relation<
    PurchaseOrderSelectedVendorOrmEntity[]
  >;

  @OneToMany(
    () => ReceiptItemOrmEntity,
    (receipt_items) => receipt_items.purchase_order_items,
  )
  receipt_items: Relation<ReceiptItemOrmEntity[]>;
}
