import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { VendorBankAccountOrmEntity } from './vendor_bank_account.orm';
import { PurchaseOrderSelectedVendorOrmEntity } from './purchase-order-selected-vendor.orm';
import { ProductOrmEntity } from './product.orm';

@Entity('vendors')
export class VendorOrmEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @Index()
  @Column({ type: 'text', nullable: true })
  contact_info: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;

  @OneToMany(
    () => VendorBankAccountOrmEntity,
    (vendor_bank_accounts) => vendor_bank_accounts.vendors,
  )
  vendor_bank_accounts: Relation<VendorBankAccountOrmEntity[]>;

  @OneToMany(
    () => PurchaseOrderSelectedVendorOrmEntity,
    (purchase_order_selected_vendors) =>
      purchase_order_selected_vendors.vendors,
  )
  purchase_order_selected_vendors: Relation<
    PurchaseOrderSelectedVendorOrmEntity[]
  >;

  @OneToMany(() => ProductOrmEntity, (products) => products.vendor)
  products: Relation<ProductOrmEntity[]>;
}
