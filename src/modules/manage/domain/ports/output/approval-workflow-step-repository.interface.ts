import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { EntityManager } from 'typeorm';
import { ApprovalWorkflowStepEntity } from '../../entities/approval-workflow-step.entity';
import { ApprovalWorkflowStepId } from '../../value-objects/approval-workflow-step-id.vo';
import { ApprovalWorkflowStepQueryDto } from '@src/modules/manage/application/dto/query/approval-workflow-step.dto';

export interface IReadApprovalWorkflowStepRepository {
  findAll(
    id: number,
    query: ApprovalWorkflowStepQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<ApprovalWorkflowStepEntity>>;

  findOne(
    id: ApprovalWorkflowStepId,
    manager: EntityManager,
  ): Promise<ResponseResult<ApprovalWorkflowStepEntity>>;
}

export interface IWriteApprovalWorkflowStepRepository {
  create(
    entity: ApprovalWorkflowStepEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<ApprovalWorkflowStepEntity>>;

  update(
    entity: ApprovalWorkflowStepEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<ApprovalWorkflowStepEntity>>;

  delete(id: ApprovalWorkflowStepId, manager: EntityManager): Promise<void>;
}
