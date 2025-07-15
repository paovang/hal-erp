import { Injectable } from '@nestjs/common';
import { DepartmentEntity } from '@src/modules/manage/domain/entities/department.entity';
import { DepartmentResponse } from '@src/modules/manage/application/dto/response/department.response';
import moment from 'moment-timezone';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { CreateDepartmentDto } from '@src/modules/manage/application/dto/create/department/create.dto';
import { UpdateDepartmentDto } from '@src/modules/manage/application/dto/create/department/update.dto';
import { UserDataMapper } from './user.mapper';

@Injectable()
export class DepartmentDataMapper {
  constructor(private readonly userDataMapper: UserDataMapper) {}
  /** Mapper Dto To Entity */
  toEntity(
    dto: CreateDepartmentDto | UpdateDepartmentDto,
    is_line_manager?: boolean,
    code?: string,
  ): DepartmentEntity {
    const builder = DepartmentEntity.builder();
    builder.code = dto.code ?? code ?? '';

    if (dto.name) {
      builder.setName(dto.name);
    }

    if (is_line_manager) {
      builder.setIsLineManager(is_line_manager);
    }

    if (dto.department_head_id) {
      builder.setDepartmentHeadId(dto.department_head_id);
    }

    return builder.build();
  }

  /** Mapper Entity To Response */
  toResponse(entity: DepartmentEntity): DepartmentResponse {
    const response = new DepartmentResponse();
    response.id = Number(entity.getId().value);
    response.code = entity.code;
    response.name = entity.name;
    response.is_line_manager = entity.is_line_manager;
    response.department_head_id = entity.department_head_id;
    response.created_at = moment
      .tz(entity.createdAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.updated_at = moment
      .tz(entity.updatedAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);

    response.department_head = entity.department_head
      ? this.userDataMapper.toResponse(entity.department_head)
      : null;

    return response;
  }
}
