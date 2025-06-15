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
import { PurchaseOrderOrmEntity } from './purchase-order.orm';
import { VendorOrmEntity } from './vendor.orm';

@Entity('purchase_order_selected_vendors')
export class PurchaseOrderSelectedVendorOrmEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Index()
  @Column({ nullable: true })
  purchase_order_id?: number;
  @ManyToOne(
    () => PurchaseOrderOrmEntity,
    (purchase_orders) => purchase_orders.purchase_order_selected_vendors,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'purchase_order_id' })
  purchase_orders: Relation<PurchaseOrderOrmEntity>;

  @Index()
  @Column({ nullable: true })
  vendor_id?: number;
  @ManyToOne(
    () => VendorOrmEntity,
    (vendors) => vendors.purchase_order_selected_vendors,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'vendor_id' })
  vendors: Relation<VendorOrmEntity>;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  filename?: string;

  @Index()
  @Column({ type: 'text', nullable: true })
  reason?: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;
}
