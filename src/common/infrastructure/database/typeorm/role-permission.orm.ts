import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoleOrmEntity } from './role.orm';
import { PermissionOrmEntity } from './permission.orm';

@Entity('roles_permissions')
export class RolePermissionOrmEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @PrimaryColumn({ name: 'role_id', type: 'bigint', unsigned: true })
  role_id: number;
  @ManyToOne(() => RoleOrmEntity, (role) => role.roles_permissions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'role_id' })
  role: RoleOrmEntity;

  @PrimaryColumn({ name: 'permission_id', type: 'bigint', unsigned: true })
  permission_id: number;

  @ManyToOne(
    () => PermissionOrmEntity,
    (permission) => permission.roles_permissions,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'permission_id' })
  permission: PermissionOrmEntity;
}
