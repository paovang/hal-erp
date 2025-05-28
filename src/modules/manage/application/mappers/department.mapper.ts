import { Injectable } from '@nestjs/common';
import { DepartmentEntity } from '@src/modules/manage/domain/entities/department.entity';
import { DepartmentResponse } from '@src/modules/manage/application/dto/response/department.response';
import moment from 'moment-timezone';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { CreateDepartmentDto } from '@src/modules/manage/application/dto/create/department/create.dto';
import { UpdateDepartmentDto } from '@src/modules/manage/application/dto/create/department/update.dto';

@Injectable()
export class DepartmentDataMapper {
  /** Mapper Dto To Entity */
  toEntity(
    dto: CreateDepartmentDto | UpdateDepartmentDto,
    code?: string,
  ): DepartmentEntity {
    const builder = DepartmentEntity.builder();
    builder.code = dto.code ?? code ?? '';

    if (dto.name) {
      builder.setName(dto.name);
    }

    return builder.build();
  }

  /** Mapper Entity To Response */
  toResponse(entity: DepartmentEntity): DepartmentResponse {
    const response = new DepartmentResponse();
    response.id = Number(entity.getId().value);
    response.code = entity.code;
    response.name = entity.name;
    response.created_at = moment
      .tz(entity.createdAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.updated_at = moment
      .tz(entity.updatedAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);

    return response;
  }
}
