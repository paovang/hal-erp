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
import { DocumentOrmEntity } from './document.orm';
import { EnumDocumentTransactionType } from '@src/modules/manage/application/constants/status-key.const';
import { BudgetItemOrmEntity } from './budget-item.orm';

@Entity('document_transactions')
export class DocumentTransactionOrmEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  transaction_number?: string;

  @Index()
  @Column({ nullable: true })
  document_id?: number;
  @ManyToOne(
    () => DocumentOrmEntity,
    (documents) => documents.document_transactions,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'document_id' })
  documents: Relation<DocumentOrmEntity>;

  @Index()
  @Column({ nullable: true })
  budget_item_id?: number;
  @ManyToOne(
    () => BudgetItemOrmEntity,
    (budget_items) => budget_items.document_transactions,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'budget_item_id' })
  budget_items: Relation<BudgetItemOrmEntity>;

  @Column({ type: 'double precision', nullable: true })
  amount?: number;

  @Index()
  @Column({ type: 'enum', enum: EnumDocumentTransactionType, nullable: true })
  transaction_type?: EnumDocumentTransactionType;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;
}
