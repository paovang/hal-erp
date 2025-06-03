import { Injectable } from '@nestjs/common';
import { CreateApprovalWorkflowDto } from '../dto/create/ApprovalWorkflow/create.dto';
import { ApprovalWorkflowEntity } from '../../domain/entities/approval-workflow.entity';
import { ApprovalWorkflowResponse } from '../dto/response/approval-workflow.response';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { DocumentTypeDataMapper } from './document-type.mapper';

@Injectable()
export class ApprovalWorkflowDataMapper {
  constructor(
    private readonly _documentTypeDataMapper: DocumentTypeDataMapper,
  ) {}
  /** Mapper Dto To Entity */
  toEntity(dto: CreateApprovalWorkflowDto): ApprovalWorkflowEntity {
    const builder = ApprovalWorkflowEntity.builder();

    if (dto.name) {
      builder.setName(dto.name);
    }

    if (dto.documentTypeId) {
      builder.setDocumentTypeId(dto.documentTypeId);
    }

    return builder.build();
  }

  /** Mapper Entity To Response */
  toResponse(entity: ApprovalWorkflowEntity): ApprovalWorkflowResponse {
    const response = new ApprovalWorkflowResponse();
    response.id = entity.getId().value;
    response.name = entity.name;
    response.created_at = moment
      .tz(entity.createdAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.updated_at = moment
      .tz(entity.updatedAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);

    response.document_type = entity.documentType
      ? this._documentTypeDataMapper.toResponse(entity.documentType)
      : null;

    return response;
  }
}
