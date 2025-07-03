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
import { PurchaseOrderItemOrmEntity } from './purchase-order-item.orm';
import { VendorOrmEntity } from './vendor.orm';

export enum SelectStatus {
  TRUE = 'true',
  FALSE = 'false',
}

@Entity('purchase_order_item_quotes')
export class PurchaseOrderItemQuoteOrmEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Index()
  @Column({ nullable: true })
  purchase_order_item_id?: number;
  @ManyToOne(
    () => PurchaseOrderItemOrmEntity,
    (purchase_order_items) => purchase_order_items.purchase_order_item_quotes,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'purchase_order_item_id' })
  purchase_order_items: Relation<PurchaseOrderItemOrmEntity>;

  @Index()
  @Column({ nullable: true })
  vendor_id?: number;
  @ManyToOne(
    () => VendorOrmEntity,
    (vendors) => vendors.purchase_order_item_quotes,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'vendor_id' })
  vendors: Relation<VendorOrmEntity>;

  @Column({ type: 'double precision', nullable: true })
  price?: number;

  @Column({ type: 'double precision', nullable: true })
  total?: number;

  @Column({
    type: 'enum',
    enum: SelectStatus,
    nullable: true,
    default: SelectStatus.TRUE,
  })
  is_selected?: SelectStatus;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;
}
