import { Injectable } from '@nestjs/common';
import { IWriteRolePermissionRepository } from '@src/modules/manage/domain/ports/output/role-permission-repository.interface';
import { RolePermissionDataAccessMapper } from '../../mappers/role-permission.mapper';
import { RolePermissionEntity } from '@src/modules/manage/domain/entities/role-permission.entity';
import { EntityManager } from 'typeorm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';

@Injectable()
export class WriteRolePermissionRepository
  implements IWriteRolePermissionRepository
{
  constructor(
    private readonly _dataAccessMapper: RolePermissionDataAccessMapper,
  ) {}

  async create(
    entity: RolePermissionEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<RolePermissionEntity>> {
    return this._dataAccessMapper.toEntity(
      await manager.save(this._dataAccessMapper.toOrmEntity(entity)),
    );
  }
}
