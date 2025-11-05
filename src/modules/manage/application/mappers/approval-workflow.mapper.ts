import { Injectable } from '@nestjs/common';
import { ApprovalWorkflowEntity } from '../../domain/entities/approval-workflow.entity';
import { ApprovalWorkflowResponse } from '../dto/response/approval-workflow.response';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { DocumentTypeDataMapper } from './document-type.mapper';
import { ApprovalWorkflowStepDataMapper } from './approval-workflow-step.mapper';
import { CreateApprovalWorkflowDto } from '../dto/create/ApprovalWorkflow/create.dto';
import { UpdateApprovalWorkflowDto } from '../dto/create/ApprovalWorkflow/update.dto';
import { ApproveDto } from '../dto/create/ApprovalWorkflow/approve.dto';
import { CompanyDataMapper } from './company.mapper';

@Injectable()
export class ApprovalWorkflowDataMapper {
  constructor(
    private readonly _documentTypeDataMapper: DocumentTypeDataMapper,
    private readonly _step: ApprovalWorkflowStepDataMapper,
    private readonly _company: CompanyDataMapper,
  ) {}
  /** Mapper Dto To Entity */
  toEntity(
    dto: CreateApprovalWorkflowDto | UpdateApprovalWorkflowDto,
    company_id?: number,
  ): ApprovalWorkflowEntity {
    const builder = ApprovalWorkflowEntity.builder();

    if (dto.name) {
      builder.setName(dto.name);
    }

    if (dto.documentTypeId) {
      builder.setDocumentTypeId(dto.documentTypeId);
    }

    if (company_id) {
      builder.setCompanyId(company_id);
    }

    return builder.build();
  }

  /** Mapper Dto To Entity */
  toEntityApprove(dto: ApproveDto): ApprovalWorkflowEntity {
    const builder = ApprovalWorkflowEntity.builder();
    builder.setStatus(dto.status);
    return builder.build();
  }

  /** Mapper Entity To Response */
  toResponse(entity: ApprovalWorkflowEntity): ApprovalWorkflowResponse {
    const response = new ApprovalWorkflowResponse();
    response.id = entity.getId().value;
    response.name = entity.name;
    response.document_type_id = entity.documentTypeId;
    response.company_id = entity.company_id;
    response.status = entity.status;
    response.created_at = moment
      .tz(entity.createdAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.updated_at = moment
      .tz(entity.updatedAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);

    response.document_type = entity.documentType
      ? this._documentTypeDataMapper.toResponse(entity.documentType)
      : null;

    response.company = entity.company
      ? this._company.toResponse(entity.company)
      : null;

    response.steps =
      entity.steps?.map((step) => this._step.toResponse(step)) ?? null;

    return response;
  }
}
