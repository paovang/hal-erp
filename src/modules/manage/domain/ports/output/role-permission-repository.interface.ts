import { EntityManager } from 'typeorm';
import { RolePermissionEntity } from '../../entities/role-permission.entity';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { RolePermissionId } from '../../value-objects/role-permission-id.vo';

export interface IWriteRolePermissionRepository {
  create(
    entity: RolePermissionEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<RolePermissionEntity>>;

  delete(id: RolePermissionId, manager: EntityManager): Promise<void>;
}
