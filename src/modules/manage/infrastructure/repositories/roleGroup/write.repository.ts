import { Injectable } from '@nestjs/common';
import { IWriteRoleGroupRepository } from '@src/modules/manage/domain/ports/output/role-group-repository.interface';
import { RoleGroupDataAccessMapper } from '../../mappers/role-group.mapper';
import { RoleGroupEntity } from '@src/modules/manage/domain/entities/role-group.entity';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { EntityManager } from 'typeorm';
import { RoleGroupOrmEntity } from '@src/common/infrastructure/database/typeorm/role-group.orm';
import { RoleId } from '@src/modules/manage/domain/value-objects/role-id.vo';

@Injectable()
export class WriteRoleGroupRepository implements IWriteRoleGroupRepository {
  constructor(private readonly _dataAccessMapper: RoleGroupDataAccessMapper) {}

  async create(
    entity: RoleGroupEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<RoleGroupEntity>> {
    return this._dataAccessMapper.toEntity(
      await manager.save(this._dataAccessMapper.toOrmEntity(entity)),
    );
  }

  async deleteByRoleId(roleId: RoleId, manager: EntityManager): Promise<void> {
    await manager.delete(RoleGroupOrmEntity, { role_id: roleId.value });
  }
}
