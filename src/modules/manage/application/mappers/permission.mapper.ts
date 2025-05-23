import { Injectable } from '@nestjs/common';
import {
  PermissionGroupResponse,
  PermissionResponse,
} from '../dto/response/permission.response';
import { PermissionGroupEntity } from '../../domain/entities/permission-group.entity';

@Injectable()
export class PermissionDataMapper {
  /** Mapper Dto To Entity */
  //   toEntity(dto: CreateDepartmentDto | UpdateDepartmentDto): DepartmentEntity {
  //     const builder = DepartmentEntity.builder();

  //     if (dto.name) {
  //       builder.setName(dto.name);
  //     }

  //     return builder.build();
  //   }

  /** Mapper Entity To Response */
  toResponse(entity: PermissionGroupEntity): PermissionGroupResponse {
    const response = new PermissionGroupResponse();
    response.id = entity.getId().value;
    response.name = entity.name;
    response.display_name = entity.displayName;
    response.type = entity.type;

    response.permissions = entity.permissions.map((p) => {
      const permission = new PermissionResponse();
      permission.id = p.getId().value;
      permission.name = p.name;
      permission.display_name = p.displayName;
      return permission;
    });

    return response;
  }
}
