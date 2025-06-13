import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CreateApprovalWorkflowStepDto } from '@src/modules/manage/application/dto/create/approvalWorkflowStep/create.dto';
import { EntityManager } from 'typeorm';
import { ApprovalWorkflowStepEntity } from '../../entities/approval-workflow-step.entity';

export interface IApprovalWorkflowStepServiceInterface {
  //   getAll(
  //     dto: ApprovalWorkflowQueryDto,
  //     manager?: EntityManager,
  //   ): Promise<ResponseResult<ApprovalWorkflowStepEntity>>;
  //   getOne(
  //     id: number,
  //     manager?: EntityManager,
  //   ): Promise<ResponseResult<ApprovalWorkflowStepEntity>>;
  create(
    id: number,
    dto: CreateApprovalWorkflowStepDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ApprovalWorkflowStepEntity>>;
  //   update(
  //     id: number,
  //     dto: UpdateApprovalWorkflowDto,
  //     manager?: EntityManager,
  //   ): Promise<ResponseResult<ApprovalWorkflowStepEntity>>;
  //   delete(id: number, manager?: EntityManager): Promise<void>;
}
