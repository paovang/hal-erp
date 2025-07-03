import { Injectable } from '@nestjs/common';
import { UserApprovalStepEntity } from '../../domain/entities/user-approval-step.entity';
import { UserApprovalStepResponse } from '../dto/response/user-approval-step.response';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { DocumentStatusDataMapper } from './document-status.mapper';
import { UserDataMapper } from './user.mapper';
import { ApprovalWorkflowStepDataMapper } from './approval-workflow-step.mapper';
import { ApprovalDto } from '../dto/create/userApprovalStep/update-statue.dto';
import { UserApprovalStepId } from '../../domain/value-objects/user-approval-step-id.vo';

interface CustomApprovalDto extends ApprovalDto {
  user_approval_id: number;
  approval_workflow_step_id: number;
}

@Injectable()
export class UserApprovalStepDataMapper {
  constructor(
    private readonly documentStatusDataMapper: DocumentStatusDataMapper,
    private readonly userDataMapper: UserDataMapper,
    private readonly approvalWorkflowStepDataMapper: ApprovalWorkflowStepDataMapper,
  ) {}
  toEntity(
    dto: ApprovalDto,
    userApprovalId?: number,
    userApprovalStepId?: number,
  ): UserApprovalStepEntity {
    const builder = UserApprovalStepEntity.builder();

    if (userApprovalStepId) {
      builder.setUserApprovalStepId(new UserApprovalStepId(userApprovalStepId));
    }

    if (userApprovalId) {
      builder.setApproverId(userApprovalId);
    }

    if (dto.statusId) {
      builder.setStatusId(dto.statusId);
    }

    if (dto.remark) {
      builder.setRemark(dto.remark);
    }

    return builder.build();
  }

  toEntityForInsert(dto: CustomApprovalDto): UserApprovalStepEntity {
    const builder = UserApprovalStepEntity.builder();
    builder.setUserApprovalId(dto.user_approval_id);
    builder.setApprovalWorkflowStepId(dto.approval_workflow_step_id);
    builder.setApproverId(dto.user_approval_id);
    builder.setStatusId(dto.statusId);
    return builder.build();
  }

  /** Mapper Entity To Response */
  toResponse(entity: UserApprovalStepEntity): UserApprovalStepResponse {
    const response = new UserApprovalStepResponse();
    response.id = Number(entity.getId().value);
    response.user_approval_id = Number(entity.user_approval_id);
    response.approval_workflow_step_id = Number(
      entity.approval_workflow_step_id,
    );
    response.approver_id = Number(entity.approver_id);
    response.approved_at = entity.approved_at
      ? moment
          .tz(entity.approved_at, Timezone.LAOS)
          .format(DateFormat.DATETIME_READABLE_FORMAT)
      : null;
    response.status_id = Number(entity.status_id);
    response.remark = entity.remark;
    response.created_at = moment
      .tz(entity.createdAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.updated_at = moment
      .tz(entity.updatedAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);

    response.document_status = entity.status
      ? this.documentStatusDataMapper.toResponse(entity.status)
      : null;

    response.user = entity.user
      ? this.userDataMapper.toResponse(entity.user)
      : null;

    response.approval_workflow_step = entity.approvalWorkflowStep
      ? this.approvalWorkflowStepDataMapper.toResponse(
          entity.approvalWorkflowStep,
        )
      : null;

    return response;
  }
}
