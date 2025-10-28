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
import { ProductOrmEntity } from './product.orm';
import { CategoryOrmEntity } from './category.orm';

@Entity('product_types')
export class ProductTypeOrmEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  name?: string;

  @Column({ nullable: true })
  category_id?: number;
  @ManyToOne(() => CategoryOrmEntity, (category) => category.productTypes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category: Relation<CategoryOrmEntity>;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;

  @OneToMany(() => ProductOrmEntity, (products) => products.product_type)
  products: Relation<ProductOrmEntity[]>;
}
