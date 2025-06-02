import { Injectable } from '@nestjs/common';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { RoleEntity } from '../../domain/entities/role.entity';
import { RoleResponse } from '../dto/response/role.response';
import moment from 'moment-timezone';
import { PermissionDataMapper } from './permission.mapper';

@Injectable()
export class RoleDataMapper {
  constructor(private readonly permissionDataMapper: PermissionDataMapper) {}
  /** Mapper Dto To Entity */
  //   toEntity(dto: CreateDepartmentDto | UpdateDepartmentDto): DepartmentEntity {
  //     const builder = DepartmentEntity.builder();

  //     if (dto.name) {
  //       builder.setName(dto.name);
  //     }

  //     return builder.build();
  //   }

  /** Mapper Entity To Response */
  toResponse(entity: RoleEntity): RoleResponse {
    const response = new RoleResponse();
    response.id = entity.getId().value;
    response.name = entity.name;
    response.created_at = moment
      .tz(entity.createdAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.updated_at = moment
      .tz(entity.updatedAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);

    response.permissions = entity.permissions
      ? entity.permissions.map((permission) =>
          this.permissionDataMapper.toResponsePermissionEntity(permission),
        )
      : [];

    return response;
  }
}
