import { Injectable } from "@nestjs/common";
import { CreateDepartmentUserDto } from "../dto/create/departmentUser/create.dto";
import { DepartmentUserEntity } from "../../domain/entities/department-user.entity";
import { Timezone } from "@src/common/domain/value-objects/timezone.vo";
import { DateFormat } from "@src/common/domain/value-objects/date-format.vo";
import moment from 'moment-timezone';
import { DepartmentUserResponse } from "../dto/response/department-user.response";

@Injectable()
export class DepartmentUserDataMapper {
  /** Mapper Dto To Entity */
  toEntity(dto: CreateDepartmentUserDto, userId?: number): DepartmentUserEntity {
    const builder = DepartmentUserEntity.builder();

    if (dto.departmentId) {
      builder.setDepartmentId(dto.departmentId);
    }

    if (dto.positionId) {
        builder.setPositionId(dto.positionId);
    }

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

    if (userId) {
        builder.setUserId(userId);
    }

    return builder.build();
  }

  /** Mapper Entity To Response */
  toResponse(entity: DepartmentUserEntity): DepartmentUserResponse {
    const response = new DepartmentUserResponse();
    response.id = entity.getId().value;
    response.department_id = entity.departmentId;
    response.created_at = moment
      .tz(entity.createdAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.updated_at = moment
      .tz(entity.updatedAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);

    return response;
  }
}