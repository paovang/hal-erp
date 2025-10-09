import { RolePermissionEntity } from '../../domain/entities/role-permission.entity';
import { RolePermissionOrmEntity } from '@src/common/infrastructure/database/typeorm/role-permission.orm';
import { RolePermissionId } from '../../domain/value-objects/role-permission-id.vo';

export class RolePermissionDataAccessMapper {
  toOrmEntity(
    rolePermissionEntity: RolePermissionEntity,
  ): RolePermissionOrmEntity {
    const id = rolePermissionEntity.getId();

    const rolePermissionOrmEntity = new RolePermissionOrmEntity();
    if (id) {
      rolePermissionOrmEntity.id = id.value;
    }

    rolePermissionOrmEntity.role_id = rolePermissionEntity.role_id;
    rolePermissionOrmEntity.permission_id = rolePermissionEntity.permission_id;
    return rolePermissionOrmEntity;
  }

  toEntity(ormData: RolePermissionOrmEntity): RolePermissionEntity {
    return RolePermissionEntity.builder()
      .setId(new RolePermissionId(ormData.id))
      .setRoleId(ormData.role_id)
      .setPermissionId(ormData.permission_id)
      .build();
  }
}
