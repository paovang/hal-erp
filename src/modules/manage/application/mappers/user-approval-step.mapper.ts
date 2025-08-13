import { Injectable } from '@nestjs/common';
import { UserApprovalStepEntity } from '../../domain/entities/user-approval-step.entity';
import { UserApprovalStepResponse } from '../dto/response/user-approval-step.response';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { DocumentStatusDataMapper } from './document-status.mapper';
import { UserDataMapper } from './user.mapper';
import { ApprovalDto } from '../dto/create/userApprovalStep/update-statue.dto';
import { UserApprovalStepId } from '../../domain/value-objects/user-approval-step-id.vo';

interface CustomApprovalDto {
  user_approval_id: number;
  step_number: number;
  statusId: number;
  requires_file_upload: boolean;
  is_otp: boolean;
}

@Injectable()
export class UserApprovalStepDataMapper {
  constructor(
    private readonly documentStatusDataMapper: DocumentStatusDataMapper,
    private readonly userDataMapper: UserDataMapper,
  ) {}
  toEntity(
    dto: ApprovalDto,
    approver?: number,
    userApprovalStepId?: number,
  ): UserApprovalStepEntity {
    const builder = UserApprovalStepEntity.builder();

    if (userApprovalStepId) {
      builder.setUserApprovalStepId(new UserApprovalStepId(userApprovalStepId));
    }

    if (approver) {
      builder.setApproverId(approver);
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
    builder.setStepNumber(dto.step_number);
    builder.setRequiresFileUpload(dto.requires_file_upload);
    builder.setStatusId(dto.statusId);
    builder.setIsOtp(dto.is_otp);
    return builder.build();
  }

  /** Mapper Entity To Response */
  toResponse(entity: UserApprovalStepEntity): UserApprovalStepResponse {
    const response = new UserApprovalStepResponse();
    response.id = Number(entity.getId().value);
    response.user_approval_id = Number(entity.user_approval_id);
    response.step_number = Number(entity.step_number);
    response.approver_id = Number(entity.approver_id);
    response.approved_at = entity.approved_at
      ? moment
          .tz(entity.approved_at, Timezone.LAOS)
          .format(DateFormat.DATETIME_READABLE_FORMAT)
      : null;
    response.status_id = Number(entity.status_id);
    response.remark = entity.remark;
    response.requires_file_upload = entity.requires_file_upload;
    response.is_otp = entity.is_otp;
    response.created_at = moment
      .tz(entity.createdAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.updated_at = moment
      .tz(entity.updatedAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);

    response.document_status = entity.status
      ? this.documentStatusDataMapper.toResponse(entity.status)
      : null;

    response.approver = entity.user
      ? this.userDataMapper.toResponse(entity.user)
      : null;

    return response;
  }
}
