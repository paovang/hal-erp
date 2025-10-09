import { Injectable } from '@nestjs/common';
import { RoleDataAccessMapper } from '../../../mappers/role.mapper';
import { IWriteRoleRepository } from '@src/modules/manage/domain/ports/output/role-repository.interface';
import { RoleEntity } from '@src/modules/manage/domain/entities/role.entity';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { EntityManager, In } from 'typeorm';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { PermissionOrmEntity } from '@src/common/infrastructure/database/typeorm/permission.orm';
import { RoleOrmEntity } from '@src/common/infrastructure/database/typeorm/role.orm';
import { RoleId } from '@src/modules/manage/domain/value-objects/role-id.vo';

@Injectable()
export class WriteRoleRepository implements IWriteRoleRepository {
  constructor(private readonly _dataAccessMapper: RoleDataAccessMapper) {}

  async create(
    entity: RoleEntity,
    manager: EntityManager,
    permissions?: number[],
  ): Promise<ResponseResult<RoleEntity>> {
    const ormEntity = this._dataAccessMapper.toOrmEntity(
      entity,
      OrmEntityMethod.CREATE,
    );

    if (permissions && permissions.length > 0) {
      const permissionEntities = await manager.find(PermissionOrmEntity, {
        where: { id: In(permissions) },
      });
      ormEntity.permissions = permissionEntities;
    }

    const saved = await manager.save(ormEntity);

    return this._dataAccessMapper.toEntity(saved);
  }

  async update(
    entity: RoleEntity,
    manager: EntityManager,
    permissions?: number[],
  ): Promise<ResponseResult<RoleEntity>> {
    const ormEntity = this._dataAccessMapper.toOrmEntity(
      entity,
      OrmEntityMethod.UPDATE,
    );

    try {
      await manager.update(RoleOrmEntity, entity.getId().value, ormEntity);

      const role = await manager.findOne(RoleOrmEntity, {
        where: { id: entity.getId().value },
        relations: ['permissions'],
      });

      if (permissions && permissions.length > 0) {
        const permissionEntities = await manager.find(PermissionOrmEntity, {
          where: { id: In(permissions) },
        });
        role!.permissions = permissionEntities;
        await manager.save(role);
      }

      return this._dataAccessMapper.toEntity(role!);
    } catch (error) {
      throw error;
    }
  }

  async delete(id: RoleId, manager: EntityManager): Promise<void> {
    try {
      await manager.softDelete(RoleOrmEntity, id.value);
    } catch (error) {
      throw error;
    }
  }
}
