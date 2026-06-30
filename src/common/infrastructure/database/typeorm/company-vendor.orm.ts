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
import { VendorOrmEntity } from './vendor.orm';

@Entity('company_vendors')
export class CompanyVendorOrmEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  company_id?: number;
  @ManyToOne(() => CompanyOrmEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'company_id' })
  company: Relation<CompanyOrmEntity>;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  vendor_id?: number;
  @ManyToOne(() => VendorOrmEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'vendor_id' })
  vendors: Relation<VendorOrmEntity>;

  @Column({ type: 'varchar', length: 50, default: 'active' })
  status: 'active' | 'inactive';

  @Column({ type: 'integer', default: 0 })
  credit_term_days: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0.0 })
  credit_limit: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  payment_term?: string | null;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;
}
