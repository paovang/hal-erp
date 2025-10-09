import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { RoleGroupEntity } from '../../entities/role-group.entity';
import { EntityManager } from 'typeorm';
import { RoleId } from '../../value-objects/role-id.vo';

export interface IWriteRoleGroupRepository {
  create(
    entity: RoleGroupEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<RoleGroupEntity>>;

  deleteByRoleId(roleId: RoleId, manager: EntityManager): Promise<void>;
}
