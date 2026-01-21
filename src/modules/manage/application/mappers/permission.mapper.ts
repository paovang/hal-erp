import { Injectable } from '@nestjs/common';
import {
  PermissionGroupResponse,
  PermissionResponse,
} from '../dto/response/permission.response';
import { PermissionGroupEntity } from '../../domain/entities/permission-group.entity';
import { PermissionEntity } from '../../domain/entities/permission.entity';

@Injectable()
export class PermissionDataMapper {
  toResponsePermissionEntity(entity: PermissionEntity): PermissionResponse {
    const response = new PermissionResponse();
    response.id = entity.getId().value;
    response.name = entity.name;
    response.display_name = entity.displayName;
    response.type = entity.type;
    return response;
  }

  /** Mapper Entity To Response */
  toResponse(entity: PermissionGroupEntity): PermissionGroupResponse {
    const response = new PermissionGroupResponse();
    response.id = entity.getId().value;
    response.name = entity.name;
    response.display_name = entity.displayName;
    response.display_name_lo = entity.displayNameLo;
    response.type = entity.type;

    response.permissions = entity.permissions.map((p) => {
      const permission = new PermissionResponse();
      permission.id = p.getId().value;
      permission.name = p.name;
      permission.display_name = p.displayName;
      permission.display_name_lo = p.displayNameLo;
      return permission;
    });

    return response;
  }
}
