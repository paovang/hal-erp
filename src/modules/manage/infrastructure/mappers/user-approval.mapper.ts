import { UserApprovalOrmEntity } from '@src/common/infrastructure/database/typeorm/user-approval.orm';
import { UserApprovalEntity } from '../../domain/entities/user-approval.entity';
import { UserApprovalId } from '../../domain/value-objects/user-approval-id.vo';
import { UserApprovalStepDataAccessMapper } from './user-approval-step.mapper';
import { DocumentStatusDataAccessMapper } from './document-status.mapper';
import { Injectable } from '@nestjs/common';
import moment from 'moment-timezone';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';

@Injectable()
export class UserApprovalDataAccessMapper {
  constructor(
    private readonly userApprovalStepMapper: UserApprovalStepDataAccessMapper,
    private readonly documentStatusMapper: DocumentStatusDataAccessMapper,
  ) {}

  toOrmEntity(
    userApprovalEntity: UserApprovalEntity,
    method: OrmEntityMethod,
  ): UserApprovalOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);
    const id = userApprovalEntity.getId();

    const mediaOrmEntity = new UserApprovalOrmEntity();
    if (id) {
      mediaOrmEntity.id = id.value;
    }

    mediaOrmEntity.document_id = userApprovalEntity.document_id;
    mediaOrmEntity.approval_workflow_id =
      userApprovalEntity.approval_workflow_id;
    mediaOrmEntity.status_id = userApprovalEntity.status_id;
    if (method === OrmEntityMethod.CREATE) {
      mediaOrmEntity.created_at = userApprovalEntity.createdAt ?? new Date(now);
    }
    mediaOrmEntity.updated_at = new Date(now);

    return mediaOrmEntity;
  }

  toEntity(ormData: UserApprovalOrmEntity): UserApprovalEntity {
    const builder = UserApprovalEntity.builder()
      .setUserApprovalId(new UserApprovalId(ormData.id))
      .setDocumentId(ormData.document_id ?? 0)
      .setApprovalWorkflowId(ormData.approval_workflow_id ?? 0)
      .setStatusId(ormData.status_id ?? 0)
      .setCreatedAt(ormData.created_at)
      .setUpdatedAt(ormData.updated_at);

    if (ormData.document_statuses) {
      builder.setStatus(
        this.documentStatusMapper.toEntity(ormData.document_statuses),
      );
    }

    if (ormData.user_approval_steps) {
      builder.setUserApprovalStep(
        ormData.user_approval_steps.map((step) =>
          this.userApprovalStepMapper.toEntity(step),
        ),
      );
    }

    return builder.build();
  }
}
