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
import { VendorOrmEntity } from './vendor.orm';
import { PurchaseOrderItemOrmEntity } from './purchase-order-item.orm';
import { SelectStatus } from '@src/modules/manage/application/constants/status-key.const';
import { VendorBankAccountOrmEntity } from './vendor_bank_account.orm';

@Entity('purchase_order_selected_vendors')
export class PurchaseOrderSelectedVendorOrmEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Index()
  @Column({ nullable: true })
  purchase_order_item_id?: number;
  @ManyToOne(
    () => PurchaseOrderItemOrmEntity,
    (purchase_order_items) =>
      purchase_order_items.purchase_order_selected_vendors,
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
    (vendors) => vendors.purchase_order_selected_vendors,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'vendor_id' })
  vendors: Relation<VendorOrmEntity>;

  @Index()
  @Column({ nullable: true })
  vendor_bank_account_id?: number;
  @ManyToOne(
    () => VendorBankAccountOrmEntity,
    (vendor_bank_account) => vendor_bank_account.selected_vendors,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'vendor_bank_account_id' })
  vendor_bank_account: Relation<VendorBankAccountOrmEntity>;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  filename?: string;

  @Index()
  @Column({ type: 'text', nullable: true })
  reason?: string;

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
