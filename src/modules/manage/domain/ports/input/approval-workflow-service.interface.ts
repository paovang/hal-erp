import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ApprovalWorkflowEntity } from '../../entities/approval-workflow.entity';
import { EntityManager } from 'typeorm';
import { ApprovalWorkflowQueryDto } from '@src/modules/manage/application/dto/query/approval-workflow.dto';
import { CreateApprovalWorkflowDto } from '@src/modules/manage/application/dto/create/ApprovalWorkflow/create.dto';
import { UpdateApprovalWorkflowDto } from '@src/modules/manage/application/dto/create/ApprovalWorkflow/update.dto';
import { ApproveDto } from '@src/modules/manage/application/dto/create/ApprovalWorkflow/approve.dto';
import { SendApprovalMailDto } from '@src/modules/manage/application/dto/create/ApprovalWorkflow/send-approval-mail.dto';
import { ApproveByTokenDto } from '@src/modules/manage/application/dto/create/ApprovalWorkflow/approve-by-token.dto';

export interface IApprovalWorkflowServiceInterface {
  getAll(
    dto: ApprovalWorkflowQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ApprovalWorkflowEntity>>;

  getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<ApprovalWorkflowEntity>>;

  create(
    dto: CreateApprovalWorkflowDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ApprovalWorkflowEntity>>;

  update(
    id: number,
    dto: UpdateApprovalWorkflowDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ApprovalWorkflowEntity>>;

  delete(id: number, manager?: EntityManager): Promise<void>;

  approve(
    id: number,
    dto: ApproveDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ApprovalWorkflowEntity>>;

  sendApprovalMail(
    id: number,
    dto: SendApprovalMailDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ApprovalWorkflowEntity>>;

  approveByToken(
    dto: ApproveByTokenDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ApprovalWorkflowEntity>>;
}
