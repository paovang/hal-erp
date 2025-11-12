import { Injectable } from '@nestjs/common';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { RoleEntity } from '../../domain/entities/role.entity';
import { RoleResponse } from '../dto/response/role.response';
import moment from 'moment-timezone';
import { PermissionDataMapper } from './permission.mapper';
import { CreateRoleDto } from '../dto/create/user/role/create.dto';
import { UpdateRoleDto } from '../dto/create/user/role/update.dto';

@Injectable()
export class RoleDataMapper {
  constructor(private readonly permissionDataMapper: PermissionDataMapper) {}
  /** Mapper Dto To Entity */
  toEntity(dto: CreateRoleDto | UpdateRoleDto, GUARD_NAME: string): RoleEntity {
    const builder = RoleEntity.builder();

    // if (dto.name) {
    //   builder.setName(dto.name);
    // }

    if (GUARD_NAME) {
      builder.setGuardName(GUARD_NAME);
    }

    return builder.build();
  }

  /** Mapper Entity To Response */
  toResponse(entity: RoleEntity): RoleResponse {
    const logo_url = entity.company_logo
      ? `${process.env.AWS_CLOUDFRONT_DISTRIBUTION_DOMAIN_NAME}/${entity.company_logo}`
      : null;
    const response = new RoleResponse();
    response.id = entity.getId().value;
    response.name = entity.name;
    response.created_at = moment
      .tz(entity.createdAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.updated_at = moment
      .tz(entity.updatedAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    // department
    response.department_id = Number(entity.department_id);
    response.department_code = entity.department_code;
    response.department_name = entity.department_name;
    // company
    response.company_id = Number(entity.company_id);
    response.company_name = entity.company_name;
    response.company_tel = entity.company_tel;
    response.company_email = entity.company_email;
    response.company_logo = entity.company_logo;
    response.company_logo_url = logo_url ?? null;
    response.company_address = entity.company_address;

    response.permissions = entity.permissions
      ? entity.permissions.map((permission) =>
          this.permissionDataMapper.toResponsePermissionEntity(permission),
        )
      : [];

    return response;
  }
}
