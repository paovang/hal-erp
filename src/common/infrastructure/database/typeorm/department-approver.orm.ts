import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { DepartmentOrmEntity } from './department.orm';
import { UserOrmEntity } from './user.orm';

@Entity('department_approvers')
export class DepartmentApproverOrmEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ nullable: true })
  department_id?: number;
  @ManyToOne(
    () => DepartmentOrmEntity,
    (departments) => departments.department_approvers,
  )
  @JoinColumn({ name: 'department_id' })
  departments: Relation<DepartmentOrmEntity>;

  @Column({ nullable: true })
  user_id?: number;
  @ManyToOne(() => UserOrmEntity, (users) => users.department_approvers)
  @JoinColumn({ name: 'user_id' })
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
