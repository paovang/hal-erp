import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { UserOrmEntity } from './user.orm';
import { PermissionOrmEntity } from './permission.orm';
import { RoleGroupOrmEntity } from './role-group.orm';
import { RolePermissionOrmEntity } from './role-permission.orm';

@Entity('roles')
export class RoleOrmEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id!: number;

  @Index()
  @Column({ type: 'varchar', length: 255, unique: true })
  name!: string;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  guard_name!: string;

  @ManyToMany(() => PermissionOrmEntity, (permission) => permission.roles, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinTable({
    name: 'role_has_permissions',
    joinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'permission_id',
      referencedColumnName: 'id',
    },
  })
  permissions: Relation<PermissionOrmEntity[]>;

  @ManyToMany(() => UserOrmEntity, (user) => user.roles, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  users: Relation<UserOrmEntity[]>;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;

  @OneToMany(() => RoleGroupOrmEntity, (roleGroup) => roleGroup.role, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  rolesGroups: Relation<RoleGroupOrmEntity[]>;

  @OneToMany(
    () => RolePermissionOrmEntity,
    (roles_permissions) => roles_permissions.role,
    {
      onDelete: 'CASCADE',
      onUpdate: 'NO ACTION',
    },
  )
  roles_permissions: Relation<RolePermissionOrmEntity[]>;
}
