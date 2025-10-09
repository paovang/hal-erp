import { Injectable } from '@nestjs/common';
import { DocumentApproverEntity } from '../../domain/entities/document-approver.entity';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { DocumentApproverResponse } from '../dto/response/document-approver.response';
import { UserDataMapper } from './user.mapper';
import { DepartmentDataMapper } from './department.mapper';

interface DocumentApproverInterface {
  user_approval_step_id: number;
  user_id: number;
}

@Injectable()
export class DocumentApproverDataMapper {
  constructor(
    private readonly user: UserDataMapper,
    private readonly department: DepartmentDataMapper,
  ) {}
  /** Mapper Dto To Entity */
  toEntity(dto: DocumentApproverInterface): DocumentApproverEntity {
    const builder = DocumentApproverEntity.builder();

    if (dto.user_approval_step_id) {
      builder.setUserApprovalStepId(dto.user_approval_step_id);
    }

    if (dto.user_id) {
      builder.setUserId(dto.user_id);
    }

    return builder.build();
  }

  /** Mapper Entity To Response */
  toResponse(entity: DocumentApproverEntity): DocumentApproverResponse {
    const response = new DocumentApproverResponse();
    response.id = Number(entity.getId().value);
    response.user_approval_step_id = Number(entity.user_approval_step_id);
    response.user_id = Number(entity.user_id);
    response.created_at = moment
      .tz(entity.createdAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.updated_at = moment
      .tz(entity.updatedAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.user = entity.user ? this.user.toResponse(entity.user) : null;
    console.log('object', entity.department);
    response.department = entity.department
      ? this.department.toResponse(entity.department)
      : null;

    return response;
  }
}
