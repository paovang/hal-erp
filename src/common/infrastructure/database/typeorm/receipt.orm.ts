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
import { PurchaseOrderOrmEntity } from './purchase-order.orm';
import { DocumentOrmEntity } from './document.orm';
import { UserOrmEntity } from './user.orm';
import { ReceiptItemOrmEntity } from './receipt.item.orm';

@Entity('receipts')
export class ReceiptOrmEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Index()
  @Column({ type: 'varchar', nullable: true, unique: true })
  receipt_number: string;

  @Index()
  @Column({ nullable: true })
  purchase_order_id?: number;
  @ManyToOne(
    () => PurchaseOrderOrmEntity,
    (purchase_orders) => purchase_orders.receipts,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'purchase_order_id' })
  purchase_orders: Relation<PurchaseOrderOrmEntity>;

  @Index()
  @Column({ nullable: true })
  document_id?: number;
  @ManyToOne(() => DocumentOrmEntity, (documents) => documents.receipts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'document_id' })
  documents: Relation<DocumentOrmEntity>;

  @Index()
  @Column({ type: 'timestamp', nullable: true })
  receipt_date: Date;

  @Index()
  @Column({ nullable: true })
  received_by?: number;
  @ManyToOne(() => UserOrmEntity, (users) => users.receipts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'received_by' })
  users: Relation<UserOrmEntity>;

  @Column({ type: 'text', nullable: true })
  remark: string;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  account_code?: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;

  @OneToMany(
    () => ReceiptItemOrmEntity,
    (receipt_items) => receipt_items.receipts,
  )
  receipt_items: Relation<ReceiptItemOrmEntity[]>;
}
