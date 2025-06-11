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
import { PurchaseRequestOrmEntity } from './purchase-request.orm';
import { BudgetItemDetailOrmEntity } from './budget-item-detail.orm';
import { UnitOrmEntity } from './unit.orm';

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

  @Index()
  @Column({ nullable: true })
  budget_item_detail_id?: number;
  @ManyToOne(
    () => BudgetItemDetailOrmEntity,
    (budget_item_details) => budget_item_details.purchase_request_items,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'budget_item_detail_id' })
  budget_item_details: Relation<BudgetItemDetailOrmEntity>;

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
  @Column({ type: 'double precision', nullable: true })
  price?: number;

  @Index()
  @Column({ type: 'double precision', nullable: true })
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
}
