import { Injectable } from '@nestjs/common';
import { RoleGroupEntity } from '../../domain/entities/role-group.entity';

@Injectable()
export class RoleGroupDataMapper {
  /** Mapper Dto To Entity */
  toEntity(role_id: number, department_id: number): RoleGroupEntity {
    const builder = RoleGroupEntity.builder();

    if (role_id) {
      builder.setRoleId(role_id);
    }

    if (department_id) {
      builder.setDepartmentId(department_id);
    }

    return builder.build();
  }

  /** Mapper Entity To Response */
  //   toResponse(entity: RoleEntity): RoleResponse {
  //     const response = new RoleResponse();
  //     response.id = entity.getId().value;
  //     response.name = entity.name;
  //     response.created_at = moment
  //       .tz(entity.createdAt, Timezone.LAOS)
  //       .format(DateFormat.DATETIME_READABLE_FORMAT);
  //     response.updated_at = moment
  //       .tz(entity.updatedAt, Timezone.LAOS)
  //       .format(DateFormat.DATETIME_READABLE_FORMAT);

  //     response.permissions = entity.permissions
  //       ? entity.permissions.map((permission) =>
  //           this.permissionDataMapper.toResponsePermissionEntity(permission),
  //         )
  //       : [];

  //     return response;
  //   }
}
