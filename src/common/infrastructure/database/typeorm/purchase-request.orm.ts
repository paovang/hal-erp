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
import { DocumentOrmEntity } from './document.orm';
import { PurchaseRequestItemOrmEntity } from './purchase-request-item.orm';
import { PurchaseOrderOrmEntity } from './purchase-order.orm';

@Entity('purchase_requests')
export class PurchaseRequestOrmEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Index()
  @Column({ nullable: true })
  document_id?: number;
  @ManyToOne(
    () => DocumentOrmEntity,
    (documents) => documents.purchase_requests,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'document_id' })
  documents: Relation<DocumentOrmEntity>;

  @Index()
  @Column({ type: 'varchar', length: 255, unique: true })
  pr_number: string;

  @Index()
  @Column({ type: 'timestamp', nullable: true })
  requested_date?: Date;

  @Index()
  @Column({ type: 'timestamp', nullable: true })
  expired_date?: Date;

  @Index()
  @Column({ type: 'text', nullable: true })
  purposes?: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;

  @OneToMany(
    () => PurchaseRequestItemOrmEntity,
    (purchase_request_items) => purchase_request_items.purchase_requests,
  )
  purchase_request_items: Relation<PurchaseRequestItemOrmEntity[]>;

  @OneToMany(
    () => PurchaseOrderOrmEntity,
    (purchase_orders) => purchase_orders.purchase_requests,
  )
  purchase_orders: Relation<PurchaseOrderOrmEntity[]>;
}
