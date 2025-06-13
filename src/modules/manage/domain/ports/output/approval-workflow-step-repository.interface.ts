import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { EntityManager } from 'typeorm';
import { ApprovalWorkflowStepEntity } from '../../entities/approval-workflow-step.entity';
import { ApprovalWorkflowStepId } from '../../value-objects/approval-workflow-step-id.vo';

// export interface IReadApprovalWorkflowStepRepository {
//   findAll(
//     query: ApprovalWorkflowQueryDto,
//     manager: EntityManager,
//   ): Promise<ResponseResult<ApprovalWorkflowEntity>>;

//   findOne(
//     id: ApprovalWorkflowId,
//     manager: EntityManager,
//   ): Promise<ResponseResult<ApprovalWorkflowEntity>>;
// }

export interface IWriteApprovalWorkflowStepRepository {
  create(
    entity: ApprovalWorkflowStepEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<ApprovalWorkflowStepEntity>>;

  //   update(
  //     entity: ApprovalWorkflowEntity,
  //     manager: EntityManager,
  //   ): Promise<ResponseResult<ApprovalWorkflowEntity>>;

  delete(id: ApprovalWorkflowStepId, manager: EntityManager): Promise<void>;
}
