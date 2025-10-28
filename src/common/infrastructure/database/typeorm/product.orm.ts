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
import { ProductTypeOrmEntity } from './product-type.orm';
import { VendorOrmEntity } from './vendor.orm';

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

  @Column({
    type: 'enum',
    enum: ['active', 'inactive'],
    default: 'active',
  })
  status: 'active' | 'inactive';

  // @Column({ nullable: true })
  // vendor_id?: number;
  // @ManyToOne(() => VendorOrmEntity, (vendor) => vendor.products, {
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE',
  // })
  // @JoinColumn({ name: 'vendor_id' })
  // vendor: Relation<VendorOrmEntity>;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;
}
