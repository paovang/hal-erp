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
  @ManyToOne(() => PositionOrmEntity, (positions) => positions.department_users)
  @JoinColumn({ name: 'position_id' })
  positions: Relation<PositionOrmEntity>;

  @Index()
  @Column({ nullable: true })
  user_id?: number;
  @ManyToOne(() => UserOrmEntity, (users) => users.department_users)
  @JoinColumn({ name: 'user_id' })
  users: Relation<UserOrmEntity>;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  signature_file?: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;
}
