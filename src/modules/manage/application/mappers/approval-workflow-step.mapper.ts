import { Injectable } from '@nestjs/common';
import { ApprovalWorkflowStepEntity } from '../../domain/entities/approval-workflow-step.entity';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { ApprovalWorkflowStepResponse } from '../dto/response/approval-workflow-step.response';
import { CreateApprovalWorkflowStepDto } from '../dto/create/approvalWorkflowStep/create.dto';

@Injectable()
export class ApprovalWorkflowStepDataMapper {
  constructor() {} // private readonly _documentTypeDataMapper: DocumentTypeDataMapper,
  /** Mapper Dto To Entity */
  toEntity(
    dto: CreateApprovalWorkflowStepDto,
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

    return builder.build();
  }

  /** Mapper Entity To Response */
  toResponse(entity: ApprovalWorkflowStepEntity): ApprovalWorkflowStepResponse {
    const response = new ApprovalWorkflowStepResponse();
    response.id = entity.getId().value;
    response.approval_workflow_id = entity.approval_workflow_id;
    response.step_name = entity.step_name;
    response.step_number = entity.step_number;
    response.department_id = Number(entity.department_id);
    response.created_at = moment
      .tz(entity.createdAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.updated_at = moment
      .tz(entity.updatedAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);

    // response.document_type = entity.documentType
    //   ? this._documentTypeDataMapper.toResponse(entity.documentType)
    //   : null;

    return response;
  }
}
