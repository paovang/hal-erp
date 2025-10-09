import { EntityManager } from 'typeorm';
import { UserApprovalEntity } from '../../entities/user-approval.entity';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { UserApprovalId } from '../../value-objects/user-approval-id.vo';

export interface IWriteUserApprovalRepository {
  create(
    entity: UserApprovalEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<UserApprovalEntity>>;

  update(
    entity: UserApprovalEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<UserApprovalEntity>>;

  delete(id: UserApprovalId, manager: EntityManager): Promise<void>;
}
