import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  DeleteDateColumn,
  OneToMany,
  Relation,
} from 'typeorm';
import { DepartmentUserOrmEntity } from './department-user.orm';
import { DepartmentApproverOrmEntity } from './department-approver.orm';

@Entity('departments')
export class DepartmentOrmEntity {
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
  () => DepartmentUserOrmEntity,
      (department_users) => department_users.departments,
  )
  department_users: Relation<DepartmentUserOrmEntity[]>;

  @OneToMany(
  () => DepartmentApproverOrmEntity,
      (department_approvers) => department_approvers.departments,
  )
  department_approvers: Relation<DepartmentApproverOrmEntity[]>;

}
