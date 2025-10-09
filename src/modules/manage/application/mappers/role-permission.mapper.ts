import { Injectable } from '@nestjs/common';
import { RolePermissionEntity } from '../../domain/entities/role-permission.entity';

@Injectable()
export class RolePermissionDataMapper {
  /** Mapper Dto To Entity */
  toEntity(role_id: number, permission_id: number): RolePermissionEntity {
    const builder = RolePermissionEntity.builder();

    if (role_id) {
      builder.setRoleId(role_id);
    }

    if (permission_id) {
      builder.setPermissionId(permission_id);
    }

    return builder.build();
  }
}
