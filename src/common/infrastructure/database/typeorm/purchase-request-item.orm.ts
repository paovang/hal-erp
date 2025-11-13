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
import { PurchaseRequestOrmEntity } from './purchase-request.orm';
import { UnitOrmEntity } from './unit.orm';
import { PurchaseOrderItemOrmEntity } from './purchase-order-item.orm';
import { QuotaCompanyOrmEntity } from './quota-company.orm';

@Entity('purchase_request_items')
export class PurchaseRequestItemOrmEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Index()
  @Column({ nullable: true })
  purchase_request_id?: number;
  @ManyToOne(
    () => PurchaseRequestOrmEntity,
    (purchase_requests) => purchase_requests.purchase_request_items,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'purchase_request_id' })
  purchase_requests: Relation<PurchaseRequestOrmEntity>;

  @Column({ nullable: true })
  quota_company_id?: number;
  @ManyToOne(
    () => QuotaCompanyOrmEntity,
    (quota_company) => quota_company.purchase_request_items,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'quota_company_id' })
  quota_company: Relation<QuotaCompanyOrmEntity>;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  title?: string;

  @Index()
  @Column({ type: 'text', nullable: true })
  file_name?: string;

  @Index()
  @Column({ type: 'integer', nullable: true })
  quantity?: number;

  @Index()
  @Column({ nullable: true })
  unit_id?: number;
  @ManyToOne(() => UnitOrmEntity, (units) => units.purchase_request_items, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'unit_id' })
  units: Relation<UnitOrmEntity>;

  @Index()
  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  price?: number;

  @Index()
  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  total_price?: number;

  @Index()
  @Column({ type: 'text', nullable: true })
  remark?: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;

  @OneToMany(
    () => PurchaseOrderItemOrmEntity,
    (purchase_order_items) => purchase_order_items.purchase_request_items,
  )
  purchase_order_items: Relation<PurchaseOrderItemOrmEntity[]>;
}
