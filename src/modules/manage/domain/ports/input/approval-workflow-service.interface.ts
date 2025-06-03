import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CreateApprovalWorkflowDto } from '@src/modules/manage/application/dto/create/ApprovalWorkflow/create.dto';
import { ApprovalWorkflowEntity } from '../../entities/approval-workflow.entity';
import { EntityManager } from 'typeorm';
import { ApprovalWorkflowQueryDto } from '@src/modules/manage/application/dto/query/approval-workflow.dto';

export interface IApprovalWorkflowServiceInterface {
  getAll(
    dto: ApprovalWorkflowQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ApprovalWorkflowEntity>>;

  //   getOne(
  //     id: number,
  //     manager?: EntityManager,
  //   ): Promise<ResponseResult<CategoryEntity>>;

  create(
    dto: CreateApprovalWorkflowDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ApprovalWorkflowEntity>>;

  //   update(
  //     id: number,
  //     dto: UpdateCategoryDto,
  //     manager?: EntityManager,
  //   ): Promise<ResponseResult<CategoryEntity>>;

  //   delete(id: number, manager?: EntityManager): Promise<void>;
}
