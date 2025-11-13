import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { VendorOrmEntity } from './vendor.orm';
import { ProductOrmEntity } from './product.orm';
import { QuotaCompanyOrmEntity } from './quota-company.orm';

@Entity('vendor_products')
export class VendorProductOrmEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  vendor_id?: number;
  @ManyToOne(() => VendorOrmEntity, (vendors) => vendors.vendor_products, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'vendor_id' })
  vendors: Relation<VendorOrmEntity>;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  product_id?: number;
  @ManyToOne(() => ProductOrmEntity, (products) => products.vendor_products)
  @JoinColumn({ name: 'product_id' })
  products: Relation<ProductOrmEntity>;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0.0 })
  price: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;

  @OneToMany(
    () => QuotaCompanyOrmEntity,
    (quota_company) => quota_company.vendor_product,
  )
  quota_company: Relation<QuotaCompanyOrmEntity[]>;
}
