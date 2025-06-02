import { Injectable } from '@nestjs/common';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { UserEntity } from '@src/modules/manage/domain/entities/user.entity';
import { IWriteUserRepository } from '@src/modules/manage/domain/ports/output/user-repository.interface';
import { EntityManager, In } from 'typeorm';
import { UserDataAccessMapper } from '../../mappers/user.mapper';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorm/user.orm';
import { UserId } from '@src/modules/manage/domain/value-objects/user-id.vo';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { RoleOrmEntity } from '@src/common/infrastructure/database/typeorm/role.orm';
import { PermissionOrmEntity } from '@src/common/infrastructure/database/typeorm/permission.orm';

@Injectable()
export class WriteUserRepository implements IWriteUserRepository {
  constructor(private readonly _dataAccessMapper: UserDataAccessMapper) {}

  async create(
    entity: UserEntity,
    manager: EntityManager,
    roleIds: number[],
    permissionIds: number[],
  ): Promise<ResponseResult<UserEntity>> {
    // const userEntity = await this._dataAccessMapper.toEntity(
    //   await manager.save(
    //     this._dataAccessMapper.toOrmEntity(entity, OrmEntityMethod.CREATE),
    //   ),
    // );

    // return userEntity;

    const ormUser = this._dataAccessMapper.toOrmEntity(
      entity,
      OrmEntityMethod.CREATE,
    );

    const roles = await manager.findBy(RoleOrmEntity, {
      id: In(roleIds),
    });

    ormUser.roles = roles;

    const savedUser = await manager.save(ormUser);

    const permissions = await manager.findBy(PermissionOrmEntity, {
      id: In(permissionIds),
    });

    for (const role of roles) {
      role.permissions = permissions;
      await manager.save(role);
    }

    return this._dataAccessMapper.toEntity(savedUser);
  }

  async update(
    entity: UserEntity,
    manager: EntityManager,
    roleIds: number[],
    permissionIds: number[],
  ): Promise<ResponseResult<UserEntity>> {
    try {
      const userOrmEntity = this._dataAccessMapper.toOrmEntity(
        entity,
        OrmEntityMethod.UPDATE,
      );
      userOrmEntity.id = entity.getId().value;

      delete (userOrmEntity as any).roles;

      const savedUser = await manager.save(userOrmEntity);

      const dbRoles = await manager.findBy(RoleOrmEntity, {
        id: In(roleIds),
      });

      const currentUser = await manager.findOne(UserOrmEntity, {
        where: { id: savedUser.id },
        relations: ['roles'],
      });

      if (currentUser?.roles?.length) {
        await manager
          .createQueryBuilder()
          .relation(UserOrmEntity, 'roles')
          .of(savedUser.id)
          .remove(currentUser.roles);
      }

      if (dbRoles.length) {
        await manager
          .createQueryBuilder()
          .relation(UserOrmEntity, 'roles')
          .of(savedUser.id)
          .add(dbRoles);
      }

      if (permissionIds?.length) {
        const permissions = await manager.findBy(PermissionOrmEntity, {
          id: In(permissionIds),
        });

        for (const role of dbRoles) {
          const currentRole = await manager.findOne(RoleOrmEntity, {
            where: { id: role.id },
            relations: ['permissions'],
          });

          if (currentRole?.permissions?.length) {
            await manager
              .createQueryBuilder()
              .relation(RoleOrmEntity, 'permissions')
              .of(role.id)
              .remove(currentRole.permissions);
          }
          if (permissions.length) {
            await manager
              .createQueryBuilder()
              .relation(RoleOrmEntity, 'permissions')
              .of(role.id)
              .add(permissions);
          }
        }
      }

      const updatedUser = await manager.findOne(UserOrmEntity, {
        where: { id: savedUser.id },
        relations: ['roles'],
      });

      return this._dataAccessMapper.toEntity(updatedUser!);
    } catch (error) {
      throw error;
    }
  }

  async changePassword(
    entity: UserEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<UserEntity>> {
    const userOrmEntity = this._dataAccessMapper.toOrmEntity(
      entity,
      OrmEntityMethod.UPDATE,
    );

    try {
      await manager.update(UserOrmEntity, entity.getId().value, userOrmEntity);

      return this._dataAccessMapper.toEntity(userOrmEntity);
    } catch (error) {
      throw error;
    }
  }

  async updateColumns(
    entity: UserEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<UserEntity>> {
    const userOrmEntity = this._dataAccessMapper.toOrmEntity(
      entity,
      OrmEntityMethod.UPDATE,
    );

    try {
      await manager.update(UserOrmEntity, entity.getId().value, userOrmEntity);

      return this._dataAccessMapper.toEntity(userOrmEntity);
    } catch (error) {
      throw error;
    }
  }

  async delete(id: UserId, manager: EntityManager): Promise<void> {
    try {
      await manager.softDelete(UserOrmEntity, id.value);
    } catch (error) {
      throw error;
    }
  }

  async sendMail(
    entity: UserEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<UserEntity>> {
    const userOrmEntity = this._dataAccessMapper.toOrmEntity(
      entity,
      OrmEntityMethod.UPDATE,
    );

    try {
      await manager.update(UserOrmEntity, entity.getId().value, userOrmEntity);

      return this._dataAccessMapper.toEntity(userOrmEntity);
    } catch (error) {
      throw error;
    }
  }
}
