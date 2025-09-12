import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { RoleOrmEntity } from './role.orm';
import { PermissionGroupOrmEntity } from './permission-group.orm';
import { UserHasPermissionOrmEntity } from './model-has-permission.orm';

@Entity('permissions')
export class PermissionOrmEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id!: number;

  @Index()
  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  guard_name!: string;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  display_name: string;

  @Index()
  @Column({ nullable: true })
  permission_group_id?: number;
  @ManyToOne(
    () => PermissionGroupOrmEntity,
    (permission_groups) => permission_groups.permissions,
  )
  @JoinColumn({ name: 'permission_group_id' })
  permission_groups: Relation<PermissionGroupOrmEntity[]>;

  @ManyToMany(() => RoleOrmEntity, (role) => role.permissions, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  roles: Relation<RoleOrmEntity[]>;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;

  @OneToMany(
    () => UserHasPermissionOrmEntity,
    (userHasPermission) => userHasPermission.permission,
  )
  userHasPermissions: Relation<UserHasPermissionOrmEntity[]>;
}
