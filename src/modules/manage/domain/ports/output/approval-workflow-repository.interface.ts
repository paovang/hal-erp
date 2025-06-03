import { EntityManager } from 'typeorm';
import { ApprovalWorkflowEntity } from '../../entities/approval-workflow.entity';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ApprovalWorkflowQueryDto } from '@src/modules/manage/application/dto/query/approval-workflow.dto';

export interface IReadApprovalWorkflowRepository {
  findAll(
    query: ApprovalWorkflowQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<ApprovalWorkflowEntity>>;

  // findOne(
  //   id: ApprovalWorkflowId,
  //   manager: EntityManager,
  // ): Promise<ResponseResult<ApprovalWorkflowEntity>>;
}

export interface IWriteApprovalWorkflowRepository {
  create(
    entity: ApprovalWorkflowEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<ApprovalWorkflowEntity>>;

  //   update(
  //     entity: ApprovalWorkflowEntity,
  //     manager: EntityManager,
  //   ): Promise<ResponseResult<ApprovalWorkflowEntity>>;

  //   delete(id: ApprovalWorkflowId, manager: EntityManager): Promise<void>;
}
