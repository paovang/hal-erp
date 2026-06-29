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
import { CompanyOrmEntity } from './company.orm';
import { ProductOrmEntity } from './product.orm';

@Entity('company_products')
@Index('uq_company_products_company_product', ['company_id', 'product_id'], {
  unique: true,
  where: '"deleted_at" IS NULL',
})
export class CompanyProductOrmEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ unsigned: true, nullable: true })
  company_id?: number;
  @ManyToOne(() => CompanyOrmEntity, (company) => company.company_products, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'company_id' })
  company: Relation<CompanyOrmEntity>;

  @Column({ unsigned: true, nullable: true })
  product_id?: number;
  @ManyToOne(() => ProductOrmEntity, (product) => product.company_products, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Relation<ProductOrmEntity>;

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
}
