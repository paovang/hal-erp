import { EntityManager } from 'typeorm';
import { RolePermissionEntity } from '../../entities/role-permission.entity';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';

export interface IWriteRolePermissionRepository {
  create(
    entity: RolePermissionEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<RolePermissionEntity>>;
}
