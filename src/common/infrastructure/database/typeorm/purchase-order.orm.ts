import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { PurchaseRequestOrmEntity } from './purchase-request.orm';
import { PurchaseOrderItemOrmEntity } from './purchase-order-item.orm';
import { DocumentOrmEntity } from './document.orm';

@Entity('purchase_orders')
export class PurchaseOrderOrmEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Index()
  @Column({ nullable: true })
  document_id?: number;
  @OneToOne(() => DocumentOrmEntity, (documents) => documents.purchase_orders, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'document_id' })
  documents: Relation<DocumentOrmEntity>;

  @Index()
  @Column({ nullable: true })
  purchase_request_id?: number;
  @ManyToOne(
    () => PurchaseRequestOrmEntity,
    (purchase_requests) => purchase_requests.purchase_orders,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'purchase_request_id' })
  purchase_requests: Relation<PurchaseRequestOrmEntity>;

  @Index()
  @Column({ type: 'varchar', length: 255, unique: true })
  po_number: string;

  @Index()
  @Column({ type: 'timestamp', nullable: true })
  order_date?: Date;

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
    () => PurchaseOrderItemOrmEntity,
    (purchase_order_items) => purchase_order_items.purchase_orders,
  )
  purchase_order_items: Relation<PurchaseOrderItemOrmEntity[]>;

  // @OneToMany(
  //   () => PurchaseOrderSelectedVendorOrmEntity,
  //   (purchase_order_selected_vendors) =>
  //     purchase_order_selected_vendors.purchase_orders,
  // )
  // purchase_order_selected_vendors: Relation<
  //   PurchaseOrderSelectedVendorOrmEntity[]
  // >;
}
