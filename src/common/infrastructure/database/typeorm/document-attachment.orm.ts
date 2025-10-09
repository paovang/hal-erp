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
import { UserOrmEntity } from './user.orm';

@Entity('document_attachments')
export class DocumentAttachmentOrmEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Index()
  @Column({ nullable: true })
  document_id?: number;
  @ManyToOne(
    () => DocumentOrmEntity,
    (documents) => documents.document_attachments,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'document_id' })
  documents: Relation<DocumentOrmEntity>;

  @Column({ type: 'varchar', length: 255, nullable: true })
  file_name?: string;

  @Index()
  @Column({ nullable: true })
  created_by?: number;
  @ManyToOne(() => UserOrmEntity, (users) => users.document_attachments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'created_by' })
  users: Relation<UserOrmEntity>;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;
}
