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
import { ReceiptOrmEntity } from './receipt.orm';
import { PurchaseOrderItemOrmEntity } from './purchase-order-item.orm';
import { CurrencyOrmEntity } from './currency.orm';
import { EnumPaymentType } from '@src/modules/manage/application/constants/status-key.const';

@Entity('receipt_items')
export class ReceiptItemOrmEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Index()
  @Column({ nullable: true })
  receipt_id?: number;
  @ManyToOne(() => ReceiptOrmEntity, (receipts) => receipts.receipt_items, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'receipt_id' })
  receipts: Relation<ReceiptOrmEntity>;

  @Index()
  @Column({ nullable: true })
  purchase_order_item_id?: number;
  @ManyToOne(
    () => PurchaseOrderItemOrmEntity,
    (purchase_order_items) => purchase_order_items.receipt_items,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'purchase_order_item_id' })
  purchase_order_items: Relation<PurchaseOrderItemOrmEntity>;

  @Column({ type: 'integer', nullable: true })
  quantity?: number;

  @Column({ type: 'double precision', nullable: true })
  price?: number;

  @Column({ type: 'double precision', nullable: true })
  total?: number;

  @Index()
  @Column({ nullable: true })
  currency_id?: number;
  @ManyToOne(() => CurrencyOrmEntity, (currency) => currency.receipt_items, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'currency_id' })
  currency: Relation<CurrencyOrmEntity>;

  @Index()
  @Column({ nullable: true })
  payment_currency_id?: number;
  @ManyToOne(
    () => CurrencyOrmEntity,
    (payment_currency) => payment_currency.receipt_item_payment,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'payment_currency_id' })
  payment_currency: Relation<CurrencyOrmEntity>;

  @Column({ type: 'double precision', nullable: true })
  exchange_rate?: number;

  @Column({ type: 'double precision', nullable: true })
  payment_total?: number;

  @Index()
  @Column({
    type: 'enum',
    enum: EnumPaymentType,
    nullable: true,
    default: EnumPaymentType.TRANSFER,
  })
  payment_type: EnumPaymentType;

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
