import { UserApprovalStepOrmEntity } from '@src/common/infrastructure/database/typeorm/user-approval-step.orm';
import { UserApprovalStepEntity } from '../../domain/entities/user-approval-step.entity';
import { UserApprovalStepId } from '../../domain/value-objects/user-approval-step-id.vo';
import { DocumentStatusDataAccessMapper } from './document-status.mapper';
import { UserDataAccessMapper } from './user.mapper';
import { Injectable } from '@nestjs/common';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { PositionDataAccessMapper } from './position.mapper';
import { DocumentApproverDataAccessMapper } from './document-approver.mapper';

@Injectable()
export class UserApprovalStepDataAccessMapper {
  constructor(
    private readonly DocumentStatusDataMapper: DocumentStatusDataAccessMapper,
    private readonly userDataMapper: UserDataAccessMapper,
    private readonly positionMapper: PositionDataAccessMapper,
    private readonly documentApproverMapper: DocumentApproverDataAccessMapper,
  ) {}

  toOrmEntity(
    userApprovalStepEntity: UserApprovalStepEntity,
    method: OrmEntityMethod,
  ): UserApprovalStepOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);
    const id = userApprovalStepEntity.getId();

    const mediaOrmEntity = new UserApprovalStepOrmEntity();
    if (id) {
      mediaOrmEntity.id = id.value;
    }

    if (method === OrmEntityMethod.UPDATE) {
      mediaOrmEntity.approver_id = userApprovalStepEntity.approver_id;
      mediaOrmEntity.approved_at =
        userApprovalStepEntity.approved_at ?? new Date(now);
    }
    mediaOrmEntity.remark = userApprovalStepEntity.remark ?? '';
    mediaOrmEntity.status_id = userApprovalStepEntity.status_id;
    mediaOrmEntity.user_approval_id = userApprovalStepEntity.user_approval_id;
    mediaOrmEntity.step_number = userApprovalStepEntity.step_number;
    mediaOrmEntity.requires_file_upload =
      userApprovalStepEntity.requires_file_upload;
    mediaOrmEntity.is_otp = userApprovalStepEntity.is_otp;
    if (method === OrmEntityMethod.CREATE) {
      mediaOrmEntity.created_at =
        userApprovalStepEntity.createdAt ?? new Date(now);
    }
    mediaOrmEntity.updated_at = new Date(now);

    return mediaOrmEntity;
  }

  toEntity(ormData: UserApprovalStepOrmEntity): UserApprovalStepEntity {
    const build = UserApprovalStepEntity.builder()
      .setUserApprovalStepId(new UserApprovalStepId(ormData.id))
      .setUserApprovalId(ormData.user_approval_id ?? 0)
      .setStepNumber(ormData.step_number ?? 0)
      .setApproverId(ormData.approver_id ?? 0)
      .setApprovedAt(ormData.approved_at ?? null)
      .setStatusId(ormData.status_id ?? 0)
      .setRemark(ormData.remark ?? '')
      .setRequiresFileUpload(ormData.requires_file_upload)
      .setIsOtp(ormData.is_otp)
      .setCreatedAt(ormData.created_at)
      .setUpdatedAt(ormData.updated_at);

    if (ormData.status) {
      build.setStatus(this.DocumentStatusDataMapper.toEntity(ormData.status));
    }

    if (ormData.approver) {
      build.setApprover(this.userDataMapper.toEntity(ormData.approver));
    }

    const positions = ormData.approver?.department_users?.map(
      (departmentUser) => departmentUser.positions,
    );
    if (positions) {
      const positionEntities = positions.map((position) =>
        this.positionMapper.toEntity(position),
      );
      build.setPosition(positionEntities);
    }
    if (ormData.document_approvers) {
      build.setDocApprover(
        ormData.document_approvers.map((docApp) =>
          this.documentApproverMapper.toEntity(docApp),
        ),
      );
    }

    return build.build();
  }
}
