import { Injectable } from '@nestjs/common';
import { ApprovalWorkflowStepEntity } from '../../domain/entities/approval-workflow-step.entity';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { ApprovalWorkflowStepResponse } from '../dto/response/approval-workflow-step.response';
import { CreateApprovalWorkflowStepDto } from '../dto/create/approvalWorkflowStep/create.dto';
import { DepartmentDataMapper } from './department.mapper';
import { UpdateApprovalWorkflowStepDto } from '../dto/create/approvalWorkflowStep/update.dto';
import { UserDataMapper } from './user.mapper';

@Injectable()
export class ApprovalWorkflowStepDataMapper {
  constructor(
    private readonly _departmentDataMapper: DepartmentDataMapper,
    private readonly _user: UserDataMapper,
  ) {}
  /** Mapper Dto To Entity */
  toEntity(
    dto: CreateApprovalWorkflowStepDto | UpdateApprovalWorkflowStepDto,
    workflow_id?: number,
  ): ApprovalWorkflowStepEntity {
    const builder = ApprovalWorkflowStepEntity.builder();

    if (dto.step_name) {
      builder.setStepName(dto.step_name);
    }

    if (dto.step_number) {
      builder.setStepNumber(dto.step_number);
    }

    if (dto.departmentId) {
      builder.setDepartmentId(dto.departmentId);
    }

    if (workflow_id) {
      builder.setApprovalWorkflowId(workflow_id);
    }

    if (dto.userId) {
      builder.setUserId(dto.userId);
    }

    if (dto.type) {
      builder.setType(dto.type);
    }

    if (dto.requires_file !== undefined && dto.requires_file !== null) {
      builder.setRequiresFile(dto.requires_file);
    }

    return builder.build();
  }

  /** Mapper Entity To Response */
  toResponse(entity: ApprovalWorkflowStepEntity): ApprovalWorkflowStepResponse {
    const response = new ApprovalWorkflowStepResponse();
    response.id = entity.getId().value;
    response.approval_workflow_id = entity.approval_workflow_id;
    response.step_name = entity.step_name;
    response.step_number = entity.step_number;
    response.department_id = Number(entity.department_id) || null;
    response.user_id = Number(entity.user_id) || null;
    response.type = entity.type;
    response.requires_file = entity.requires_file;
    response.created_at = moment
      .tz(entity.createdAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.updated_at = moment
      .tz(entity.updatedAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);

    response.department = entity.department
      ? this._departmentDataMapper.toResponse(entity.department)
      : null;

    response.user = entity.user ? this._user.toResponse(entity.user) : null;

    return response;
  }
}
