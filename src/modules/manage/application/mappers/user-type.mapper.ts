import { Injectable } from '@nestjs/common';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { UserDataMapper } from './user.mapper';
import { CreateUserTypeDto } from '../dto/create/user-type/create.dto';
import { UpdateUserTypeDto } from '../dto/create/user-type/update.dto';
import { UserTypeEntity } from '../../domain/entities/user-type.entity';
import { UserTypeResponse } from '../dto/response/user-type.response';

@Injectable()
export class UserTypeDataMapper {
  /** Mapper Dto To Entity */
  constructor(private readonly userDataMapper: UserDataMapper) {}
  toEntity(
    dto: CreateUserTypeDto | UpdateUserTypeDto, // Remove array type
    user_id: number,
  ): UserTypeEntity {
    // Remove array return type
    const builder = UserTypeEntity.builder();

    if (dto.name) {
      builder.setName(dto.name);
    }

    if (user_id) {
      builder.setUserId(user_id);
    }

    return builder.build();
  }
  /** Mapper Entity To Response */
  toResponse(entity: UserTypeEntity): UserTypeResponse {
    const response = new UserTypeResponse();
    response.id = entity.getId().value;
    response.name = entity.name;
    response.user_id = entity.user_id;
    response.created_at = moment
      .tz(entity.createdAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.updated_at = moment
      .tz(entity.updatedAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.user = entity.user
      ? this.userDataMapper.toResponse(entity.user)
      : null;
    return response;
  }
}
