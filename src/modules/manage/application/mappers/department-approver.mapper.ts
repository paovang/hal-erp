import { Injectable } from '@nestjs/common';
import { DepartmentApproverEntity } from '../../domain/entities/department-approver.entity';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import moment from 'moment-timezone';
import { DepartmentApproverResponse } from '../dto/response/department-approver.response';
import { DepartmentDataMapper } from './department.mapper';
import { UserDataMapper } from './user.mapper';
import { UpdateDepartmentApproverDto } from '../dto/create/departmentApprover/update.dto';

@Injectable()
export class DepartmentApproverDataMapper {
  constructor(
    private readonly departmentDataMapper: DepartmentDataMapper,
    private readonly userDataMapper: UserDataMapper,
  ) {}
  /** Mapper Dto To Entity */
  toEntity(
    dto: UpdateDepartmentApproverDto,
    // | CreateDepartmentApproverDto
    // | UpdateDepartmentApproverDto
    // | CreateDepartmentApproverByUserDto,
    departmentId?: number,
    // user_id?: number,
  ): DepartmentApproverEntity {
    const builder = DepartmentApproverEntity.builder();

    if (departmentId) {
      builder.setDepartmentId(departmentId);
    }

    if (dto.user_id) {
      builder.setUserId(dto.user_id);
    }

    return builder.build();
  }

  toEntityArray(
    departmentId?: number,
    user_id?: number,
    company_id?: number,
  ): DepartmentApproverEntity {
    const builder = DepartmentApproverEntity.builder();

    if (departmentId) {
      builder.setDepartmentId(departmentId);
    }

    if (user_id) {
      builder.setUserId(user_id);
    }

    if (company_id) {
      builder.setCompanyId(company_id);
    }

    return builder.build();
  }

  /** Mapper Entity To Response */
  toResponse(entity: DepartmentApproverEntity): DepartmentApproverResponse {
    const response = new DepartmentApproverResponse();
    response.id = entity.getId().value;
    response.department_id = entity.departmentId ?? null;
    response.company_id = entity.companyId ?? null;
    response.user_id = entity.userId ?? null;
    response.created_at = moment
      .tz(entity.createdAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.updated_at = moment
      .tz(entity.updatedAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);

    response.department = entity.department
      ? this.departmentDataMapper.toResponse(entity.department)
      : null;

    response.user = entity.user
      ? this.userDataMapper.toResponse(entity.user)
      : null;

    return response;
  }
}
