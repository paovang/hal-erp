import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { ApprovalWorkflowEntity } from '../../domain/entities/approval-workflow.entity';
import { ApprovalWorkflowOrmEntity } from '@src/common/infrastructure/database/typeorm/approval-workflow.orm';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { ApprovalWorkflowId } from '../../domain/value-objects/approval-workflow-id.vo';
import { Injectable } from '@nestjs/common';
import { DocumentTypeDataAccessMapper } from './document-type.mapper';
import { ApprovalWorkflowStepDataAccessMapper } from './approval-workflow-step.mapper';

@Injectable()
export class ApprovalWorkflowDataAccessMapper {
  constructor(
    private readonly _documentTypeMapper: DocumentTypeDataAccessMapper,
    private readonly _step: ApprovalWorkflowStepDataAccessMapper,
  ) {}
  toOrmEntity(
    approvalWorkflowEntity: ApprovalWorkflowEntity,
    method: OrmEntityMethod,
  ): ApprovalWorkflowOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);
    const id = approvalWorkflowEntity.getId();

    const mediaOrmEntity = new ApprovalWorkflowOrmEntity();
    if (id) {
      mediaOrmEntity.id = id.value;
    }

    mediaOrmEntity.document_type_id = approvalWorkflowEntity.documentTypeId;
    mediaOrmEntity.name = approvalWorkflowEntity.name;
    if (method === OrmEntityMethod.CREATE) {
      mediaOrmEntity.created_at =
        approvalWorkflowEntity.createdAt ?? new Date(now);
    }
    mediaOrmEntity.updated_at = new Date(now);

    return mediaOrmEntity;
  }

  toEntity(ormData: ApprovalWorkflowOrmEntity): ApprovalWorkflowEntity {
    const build = ApprovalWorkflowEntity.builder()
      .setApprovalWorkflowId(new ApprovalWorkflowId(ormData.id))
      .setDocumentTypeId(ormData.document_type_id!)
      .setName(ormData.name ?? '')
      .setCreatedAt(ormData.created_at)
      .setUpdatedAt(ormData.updated_at);

    if (ormData.document_types) {
      build.setDocumentType(
        this._documentTypeMapper.toEntity(ormData.document_types),
      );
    }

    if (ormData.approval_workflow_steps) {
      build.setSteps(
        ormData.approval_workflow_steps.map((step) =>
          this._step.toEntity(step),
        ),
      );
    }

    return build.build();
  }
}
