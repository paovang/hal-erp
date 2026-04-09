import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { DocumentTypeOrmEntity } from './document-type.orm';
export enum DocumentCategoryCode {
  PR = 'PR',
  PO = 'PO',
  RECEIPT = 'RECEIPT',
  INVOICE = 'INVOICE',
}
@Entity('document_categories')
export class DocumentCategoryOrmEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Index()
  @Column({ type: 'enum', enum: DocumentCategoryCode, unique: true })
  code: DocumentCategoryCode;

  @Index()
  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @OneToMany(
    () => DocumentTypeOrmEntity,
    (document_types) => document_types.document_category,
  )
  document_types: Relation<DocumentTypeOrmEntity[]>;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;
}
