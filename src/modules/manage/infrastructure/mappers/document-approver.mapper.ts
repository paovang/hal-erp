import { Injectable } from '@nestjs/common';
import { DocumentApproverEntity } from '../../domain/entities/document-approver.entity';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { DocumentApproverOrmEntity } from '@src/common/infrastructure/database/typeorm/document-approver.orm';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { DocumentApproverId } from '../../domain/value-objects/document-approver-id.vo';
import { UserDataAccessMapper } from './user.mapper';
import { DepartmentDataAccessMapper } from './department.mapper';

@Injectable()
export class DocumentApproverDataAccessMapper {
  constructor(
    private readonly user: UserDataAccessMapper,
    private readonly department: DepartmentDataAccessMapper,
  ) {}
  toOrmEntity(
    documentApproverEntity: DocumentApproverEntity,
    method: OrmEntityMethod,
  ): DocumentApproverOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);
    const id = documentApproverEntity.getId();

    const mediaOrmEntity = new DocumentApproverOrmEntity();
    if (id) {
      mediaOrmEntity.id = id.value;
    }
    mediaOrmEntity.user_approval_step_id =
      documentApproverEntity.user_approval_step_id;
    mediaOrmEntity.user_id = documentApproverEntity.user_id;
    if (method === OrmEntityMethod.CREATE) {
      mediaOrmEntity.created_at =
        documentApproverEntity.createdAt ?? new Date(now);
    }
    mediaOrmEntity.updated_at = new Date(now);

    return mediaOrmEntity;
  }

  toEntity(ormData: DocumentApproverOrmEntity): DocumentApproverEntity {
    const builder = DocumentApproverEntity.builder()
      .setDocumentApproverId(new DocumentApproverId(ormData.id))
      .setUserApprovalStepId(ormData.user_approval_step_id ?? 0)
      .setUserId(ormData.user_id ?? 0)
      .setCreatedAt(ormData.created_at)
      .setUpdatedAt(ormData.updated_at);
    if (ormData.users) {
      builder.setUser(this.user.toEntity(ormData.users));

      if (ormData.users.department_users[0].departments) {
        builder.setDepartment(
          this.department.toEntity(
            ormData.users.department_users[0].departments,
          ),
        );
      }
    }

    return builder.build();
  }
}
