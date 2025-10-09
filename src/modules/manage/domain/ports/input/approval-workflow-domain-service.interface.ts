import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CreateApprovalWorkflowStepDto } from '@src/modules/manage/application/dto/create/approvalWorkflowStep/create.dto';
import { EntityManager } from 'typeorm';
import { ApprovalWorkflowStepEntity } from '../../entities/approval-workflow-step.entity';
import { ApprovalWorkflowStepQueryDto } from '@src/modules/manage/application/dto/query/approval-workflow-step.dto';
import { UpdateApprovalWorkflowStepDto } from '@src/modules/manage/application/dto/create/approvalWorkflowStep/update.dto';

export interface IApprovalWorkflowStepServiceInterface {
  getAll(
    id: number,
    dto: ApprovalWorkflowStepQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ApprovalWorkflowStepEntity>>;

  getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<ApprovalWorkflowStepEntity>>;

  create(
    id: number,
    dto: CreateApprovalWorkflowStepDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ApprovalWorkflowStepEntity>>;

  update(
    id: number,
    dto: UpdateApprovalWorkflowStepDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ApprovalWorkflowStepEntity>>;

  delete(id: number, manager?: EntityManager): Promise<void>;
}
