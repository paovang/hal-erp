import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "../dto/create/user/create.dto";
import { UserEntity } from "../../domain/entities/user.entity";
import { Timezone } from "@src/common/domain/value-objects/timezone.vo";
import { DateFormat } from "@src/common/domain/value-objects/date-format.vo";
import moment from 'moment-timezone';
import { UserResponse } from "../dto/response/user.response";
import { UpdateUserDto } from "../dto/create/user/update.dto";

@Injectable()
export class UserDataMapper {
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

    return builder.build();
  }

  toEntityForUpdate(dto: UpdateUserDto): UserEntity {
    const builder = UserEntity.builder();
  
    if (dto.username) builder.setUsername(dto.username);
    if (dto.email) builder.setEmail(dto.email);
    if (dto.tel) builder.setTel(dto.tel);
  
    return builder.build(); // no password set here
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

    return response;
  }
}
