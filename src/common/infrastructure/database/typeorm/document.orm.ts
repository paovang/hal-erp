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
import { DepartmentOrmEntity } from './department.orm';
import { UserOrmEntity } from './user.orm';
import { PurchaseRequestOrmEntity } from './purchase-request.orm';

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

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;

  @OneToMany(
    () => PurchaseRequestOrmEntity,
    (purchase_requests) => purchase_requests.documents,
  )
  purchase_requests: Relation<PurchaseRequestOrmEntity[]>;
}
