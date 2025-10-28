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
import { DepartmentOrmEntity } from './department.orm';
import { PositionOrmEntity } from './position.orm';
import { UserOrmEntity } from './user.orm';
import { CompanyOrmEntity } from './company.orm';

@Entity('department_users')
export class DepartmentUserOrmEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Index()
  @Column({ nullable: true })
  department_id?: number;
  @ManyToOne(
    () => DepartmentOrmEntity,
    (departments) => departments.department_users,
  )
  @JoinColumn({ name: 'department_id' })
  departments: Relation<DepartmentOrmEntity>;

  @Index()
  @Column({ nullable: true })
  position_id?: number;
  @ManyToOne(
    () => PositionOrmEntity,
    (positions) => positions.department_users,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'position_id' })
  positions: Relation<PositionOrmEntity>;

  @Index()
  @Column({ nullable: true })
  user_id?: number;
  @ManyToOne(() => UserOrmEntity, (users) => users.department_users, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  users: Relation<UserOrmEntity>;

  @Column({ nullable: true })
  company_id?: number;
  @ManyToOne(
    () => CompanyOrmEntity,
    (company) => company.department_approvers,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'company_id' })
  company: Relation<CompanyOrmEntity>;

  @Index()
  @Column({ nullable: true })
  line_manager_id?: number;
  @ManyToOne(
    () => UserOrmEntity,
    (line_manager) => line_manager.department_users,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'line_manager_id' })
  line_manager: Relation<UserOrmEntity>;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;
}
