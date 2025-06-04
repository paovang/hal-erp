import { Entity, ManyToOne, JoinColumn, PrimaryColumn, Index } from 'typeorm';
import { PermissionOrmEntity } from './permission.orm';
import { UserOrmEntity } from './user.orm';

@Entity('user_has_permissions')
@Index('user_has_permissions_user_id_index', ['user_id'])
@Index('user_has_permissions_permission_id_index', ['permission_id'])
export class UserHasPermissionOrmEntity {
  @PrimaryColumn({ name: 'permission_id', type: 'bigint', unsigned: true })
  permission_id: number;

  @PrimaryColumn({ name: 'user_id', type: 'bigint', unsigned: true })
  user_id: number;

  @ManyToOne(
    () => PermissionOrmEntity,
    (permission) => permission.userHasPermissions,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'permission_id' })
  permission: PermissionOrmEntity;

  @ManyToOne(() => UserOrmEntity, (user) => user.userHasPermissions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserOrmEntity;
}
