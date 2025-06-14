import { Injectable } from '@nestjs/common';
import { ApprovalWorkflowStepEntity } from '../../domain/entities/approval-workflow-step.entity';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { ApprovalWorkflowStepOrmEntity } from '@src/common/infrastructure/database/typeorm/approval-workflow-step.orm';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { ApprovalWorkflowStepId } from '../../domain/value-objects/approval-workflow-step-id.vo';
import { DepartmentDataAccessMapper } from './department.mapper';

@Injectable()
export class ApprovalWorkflowStepDataAccessMapper {
  constructor(private readonly _departmentMapper: DepartmentDataAccessMapper) {}
  toOrmEntity(
    approvalWorkflowStepEntity: ApprovalWorkflowStepEntity,
    method: OrmEntityMethod,
  ): ApprovalWorkflowStepOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);
    const id = approvalWorkflowStepEntity.getId();

    const mediaOrmEntity = new ApprovalWorkflowStepOrmEntity();
    if (id) {
      mediaOrmEntity.id = id.value;
    }

    mediaOrmEntity.approval_workflow_id =
      approvalWorkflowStepEntity.approval_workflow_id;
    mediaOrmEntity.step_name = approvalWorkflowStepEntity.step_name;
    mediaOrmEntity.step_number = approvalWorkflowStepEntity.step_number;
    mediaOrmEntity.department_id = approvalWorkflowStepEntity.department_id;
    if (method === OrmEntityMethod.CREATE) {
      mediaOrmEntity.created_at =
        approvalWorkflowStepEntity.createdAt ?? new Date(now);
    }
    mediaOrmEntity.updated_at = new Date(now);

    return mediaOrmEntity;
  }

  toEntity(ormData: ApprovalWorkflowStepOrmEntity): ApprovalWorkflowStepEntity {
    const build = ApprovalWorkflowStepEntity.builder()
      .setApprovalWorkflowStepId(new ApprovalWorkflowStepId(ormData.id))
      .setApprovalWorkflowId(ormData.approval_workflow_id ?? 0)
      .setStepName(ormData.step_name ?? '')
      .setStepNumber(ormData.step_number ?? 0)
      .setDepartmentId(ormData.department_id ?? 0)
      .setCreatedAt(ormData.created_at)
      .setUpdatedAt(ormData.updated_at);

    if (ormData.departments) {
      build.setDepartment(this._departmentMapper.toEntity(ormData.departments));
    }

    return build.build();
  }
}
