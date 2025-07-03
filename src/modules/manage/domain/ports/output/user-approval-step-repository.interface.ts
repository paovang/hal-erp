import { EntityManager } from 'typeorm';
import { UserApprovalStepEntity } from '../../entities/user-approval-step.entity';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { UserApprovalStepId } from '../../value-objects/user-approval-step-id.vo';

export interface IWriteUserApprovalStepRepository {
  create(
    entity: UserApprovalStepEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<UserApprovalStepEntity>>;

  update(
    entity: UserApprovalStepEntity,
    manager: EntityManager,
    userApprovalStepId?: number,
  ): Promise<ResponseResult<UserApprovalStepEntity>>;

  delete(id: UserApprovalStepId, manager: EntityManager): Promise<void>;
}
