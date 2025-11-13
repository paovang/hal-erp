import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { CompanyOrmEntity } from './company.orm';
import { VendorProductOrmEntity } from './vendor-product.orm';

@Entity('quota_companies')
export class QuotaCompanyOrmEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ nullable: true })
  company_id?: number;
  @ManyToOne(() => CompanyOrmEntity, (company) => company.quota_company, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'company_id' })
  company: Relation<CompanyOrmEntity>;

  @Column({ nullable: true })
  vendor_product_id?: number;
  @ManyToOne(
    () => VendorProductOrmEntity,
    (vendor_product) => vendor_product.quota_company,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'vendor_product_id' })
  vendor_product: Relation<VendorProductOrmEntity>;

  @Column({ type: 'integer', nullable: true })
  qty?: number;

  @Column({ type: 'date', nullable: true })
  year?: Date;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;
}
