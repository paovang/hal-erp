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
import { ApprovalWorkflowOrmEntity } from './approval-workflow.orm';
import { DocumentOrmEntity } from './document.orm';

@Entity('document_types')
export class DocumentTypeOrmEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Index()
  @Column({ type: 'varchar', length: 255, unique: true })
  code: string;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;

  @OneToMany(
    () => ApprovalWorkflowOrmEntity,
    (approval_workflows) => approval_workflows.document_types,
  )
  approval_workflows: Relation<ApprovalWorkflowOrmEntity[]>;

  @OneToMany(() => DocumentOrmEntity, (documents) => documents.document_types)
  documents: Relation<DocumentOrmEntity[]>;
}
