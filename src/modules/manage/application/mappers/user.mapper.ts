import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create/user/create.dto';
import { UserEntity } from '../../domain/entities/user.entity';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import moment from 'moment-timezone';
import { UserResponse } from '../dto/response/user.response';
import { UpdateUserDto } from '../dto/create/user/update.dto';
import { ChangePasswordDto } from '../dto/create/user/change-password.dto';
import { SendMailDto } from '../dto/create/user/send-email.dto';
import { RoleDataMapper } from './role.mapper';
import { PermissionDataMapper } from './permission.mapper';
import { PermissionResponse } from '../dto/response/permission.response';

@Injectable()
export class UserDataMapper {
  constructor(
    private readonly roleDataMapper: RoleDataMapper,
    private readonly permissionDataMapper: PermissionDataMapper,
  ) {}

  /** Mapper Dto To Entity */
  toEntity(dto: CreateUserDto): UserEntity {
    const builder = UserEntity.builder();

    if (dto.username) {
      builder.setUsername(dto.username);
    }

    if (dto.email) {
      builder.setEmail(dto.email);
    }

    if (dto.tel) {
      builder.setTel(dto.tel);
    }

    if (dto.password) {
      builder.setPassword(dto.password);
    }

    if (dto.roleIds) {
      builder.setRoleIds(dto.roleIds);
    }

    if (dto.permissionIds) {
      builder.setPermissionIds(dto.permissionIds);
    }

    return builder.build();
  }

  toEntitySendEmail(dto: SendMailDto): UserEntity {
    const builder = UserEntity.builder();

    if (dto.email) {
      builder.setEmail(dto.email);
    }

    return builder.build();
  }

  toEntityForUpdate(dto: UpdateUserDto): UserEntity {
    const builder = UserEntity.builder();

    if (dto.username) builder.setUsername(dto.username);
    if (dto.email) builder.setEmail(dto.email);
    if (dto.tel) builder.setTel(dto.tel);

    return builder.build(); // no password set here
  }

  toEntityForChangePassword(dto: ChangePasswordDto): UserEntity {
    const builder = UserEntity.builder();

    if (dto.old_password) {
      builder.setPassword(dto.old_password);
    }

    if (dto.new_password) {
      builder.setPassword(dto.new_password);
    }

    return builder.build();
  }

  toEntityForUpdateColumns({
    email,
    tel,
  }: {
    email: string;
    tel: string;
  }): UserEntity {
    const builder = UserEntity.builder();
    if (email) builder.setEmail(email);
    if (tel) builder.setTel(tel);

    return builder.build();
  }

  /** Mapper Entity To Response */
  toResponse(entity: UserEntity): UserResponse {
    const response = new UserResponse();
    response.id = entity.getId().value;
    response.username = entity.username;
    response.email = entity.email;
    response.tel = entity.tel;
    response.created_at = moment
      .tz(entity.createdAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.updated_at = moment
      .tz(entity.updatedAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);

    response.roles = entity.roles
      ? entity.roles.map((role) => this.roleDataMapper.toResponse(role))
      : [];

    response.permissions = entity.permissions
      ? entity.permissions.map((p) => {
          const permission = new PermissionResponse();
          permission.id = p.getId().value;
          permission.name = p.name;
          permission.display_name = p.displayName;
          return permission;
        })
      : [];

    return response;
  }
}
