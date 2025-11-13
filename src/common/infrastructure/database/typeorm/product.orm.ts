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
import { ProductTypeOrmEntity } from './product-type.orm';
import { VendorProductOrmEntity } from './vendor-product.orm';
import { UnitOrmEntity } from './unit.orm';

@Entity('products')
export class ProductOrmEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  name?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true })
  product_type_id?: number;
  @ManyToOne(
    () => ProductTypeOrmEntity,
    (product_type) => product_type.products,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'product_type_id' })
  product_type: Relation<ProductTypeOrmEntity>;

  @Column({ nullable: true })
  unit_id?: number;
  @ManyToOne(() => UnitOrmEntity, (unit) => unit.products, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'unit_id' })
  unit: Relation<UnitOrmEntity>;

  @Column({
    type: 'enum',
    enum: ['active', 'inactive'],
    default: 'active',
  })
  status: 'active' | 'inactive';

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;

  /** Relation */
  @OneToMany(
    () => VendorProductOrmEntity,
    (vendor_products) => vendor_products.products,
  )
  vendor_products: Relation<VendorProductOrmEntity[]>;
}
