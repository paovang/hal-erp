import { Injectable } from '@nestjs/common';
import { UserApprovalEntity } from '../../domain/entities/user-approval.entity';
import { UserApprovalResponse } from '../dto/response/user-approval.response';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { UserApprovalStepDataMapper } from './user-approval-step.mapper';
import { DocumentStatusDataMapper } from './document-status.mapper';
import { CreateUserApprovalDto } from '../dto/create/userApproval/create.dto';

interface CustomUserApprovalDto extends CreateUserApprovalDto {
  status: number;
}

interface UpdateUserApprovalStatusDto {
  status: number;
}

@Injectable()
export class UserApprovalDataMapper {
  constructor(
    private readonly userApprovalStepDataMapper: UserApprovalStepDataMapper,
    private readonly documentStatusDataMapper: DocumentStatusDataMapper,
  ) {}

  toEntity(
    dto: CustomUserApprovalDto,
    approval_workflow_id?: number,
  ): UserApprovalEntity {
    const builder = UserApprovalEntity.builder();

    if (dto.documentId) {
      builder.setDocumentId(dto.documentId);
    }

    if (approval_workflow_id) {
      builder.setApprovalWorkflowId(approval_workflow_id);
    }

    if (dto.status) {
      builder.setStatusId(dto.status);
    }

    return builder.build();
  }

  toEntityUpdate(dto: UpdateUserApprovalStatusDto): UserApprovalEntity {
    const builder = UserApprovalEntity.builder();
    if (dto.status) {
      builder.setStatusId(dto.status);
    }
    return builder.build();
  }

  /** Mapper Entity To Response */
  toResponse(entity: UserApprovalEntity): UserApprovalResponse {
    const response = new UserApprovalResponse();
    response.id = Number(entity.getId().value);
    response.document_id = Number(entity.document_id);
    response.approval_workflow_id = Number(entity.approval_workflow_id);
    response.status_id = entity.status_id;
    response.created_at = moment
      .tz(entity.createdAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.updated_at = moment
      .tz(entity.updatedAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);

    response.document_status = entity.status
      ? this.documentStatusDataMapper.toResponse(entity.status)
      : null;

    response.approval_step =
      entity.userApprovalSteps?.map((step) => {
        return this.userApprovalStepDataMapper.toResponse(step);
      }) ?? [];

    return response;
  }
}
