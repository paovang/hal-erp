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
import { DepartmentOrmEntity } from './department.orm';
import { UserOrmEntity } from './user.orm';
import { PurchaseRequestOrmEntity } from './purchase-request.orm';
import { DocumentTypeOrmEntity } from './document-type.orm';
import { UserApprovalOrmEntity } from './user-approval.orm';
import { PurchaseOrderOrmEntity } from './purchase-order.orm';
import { ReceiptOrmEntity } from './receipt.orm';
import { DocumentAttachmentOrmEntity } from './document-attachment.orm';
import { DocumentTransactionOrmEntity } from './document-transaction.orm';
import { EnumDocumentStatus } from '@src/modules/manage/application/constants/status-key.const';

@Entity('documents')
export class DocumentOrmEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Index()
  @Column({ type: 'varchar', length: 255, unique: true })
  document_number: string;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  title?: string;

  @Index()
  @Column({ type: 'text', nullable: true })
  description?: string;

  @Index()
  @Column({ type: 'double precision', nullable: true })
  total_amount?: number;

  @Index()
  @Column({ nullable: true })
  document_type_id?: number;
  @ManyToOne(
    () => DocumentTypeOrmEntity,
    (document_types) => document_types.documents,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'document_type_id' })
  document_types: Relation<DocumentTypeOrmEntity>;

  @Index()
  @Column({ nullable: true })
  department_id?: number;
  @ManyToOne(
    () => DepartmentOrmEntity,
    (departments) => departments.documents,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'department_id' })
  departments: Relation<DepartmentOrmEntity>;

  @Index()
  @Column({ nullable: true })
  requester_id?: number;
  @ManyToOne(() => UserOrmEntity, (users) => users.documents, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'requester_id' })
  users: Relation<UserOrmEntity>;

  @Index()
  @Column({
    type: 'enum',
    enum: EnumDocumentStatus,
    default: EnumDocumentStatus.PENDING,
  })
  status: EnumDocumentStatus;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;

  @OneToOne(
    () => PurchaseRequestOrmEntity,
    (purchase_requests) => purchase_requests.documents,
  )
  purchase_requests: Relation<PurchaseRequestOrmEntity>;

  @OneToOne(
    () => PurchaseOrderOrmEntity,
    (purchase_orders) => purchase_orders.documents,
  )
  purchase_orders: Relation<PurchaseOrderOrmEntity>;

  @OneToOne(
    () => UserApprovalOrmEntity,
    (user_approvals) => user_approvals.documents,
  )
  user_approvals: Relation<UserApprovalOrmEntity>;

  @OneToOne(() => ReceiptOrmEntity, (receipts) => receipts.documents)
  receipts: Relation<ReceiptOrmEntity>;

  @OneToMany(
    () => DocumentAttachmentOrmEntity,
    (document_attachments) => document_attachments.documents,
  )
  document_attachments: Relation<DocumentAttachmentOrmEntity[]>;

  @OneToMany(
    () => DocumentTransactionOrmEntity,
    (document_transactions) => document_transactions.documents,
  )
  document_transactions: Relation<DocumentTransactionOrmEntity[]>;
}
