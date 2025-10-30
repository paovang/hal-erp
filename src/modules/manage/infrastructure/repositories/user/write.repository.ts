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
import { UserHasPermissionOrmEntity } from '@src/common/infrastructure/database/typeorm/model-has-permission.orm';

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

    const userHasPermissions = permissions.map((permission) => {
      const userHasPermission = new UserHasPermissionOrmEntity();
      userHasPermission.user = savedUser;
      userHasPermission.permission = permission;
      return userHasPermission;
    });

    await manager.save(UserHasPermissionOrmEntity, userHasPermissions);

    return this._dataAccessMapper.toEntity(savedUser);
  }

  async createWithCompany(
    entity: UserEntity,
    manager: EntityManager,
    role_id: number,
  ): Promise<ResponseResult<UserEntity>> {
    const ormEntity = this._dataAccessMapper.toOrmEntity(
      entity,
      OrmEntityMethod.CREATE,
    );

    const roles = await manager.findBy(RoleOrmEntity, {
      id: role_id,
    });

    ormEntity.roles = roles;

    return this._dataAccessMapper.toEntity(await manager.save(ormEntity));
  }

  async update(
    entity: UserEntity,
    manager: EntityManager,
    roleIds: number[],
    permissionIds: number[],
  ): Promise<ResponseResult<UserEntity>> {
    return await manager.transaction(async (transactionalEntityManager) => {
      const userOrmEntity = this._dataAccessMapper.toOrmEntity(
        entity,
        OrmEntityMethod.UPDATE,
      );
      userOrmEntity.id = entity.getId().value;

      delete (userOrmEntity as any).roles;

      const savedUser = await transactionalEntityManager.save(userOrmEntity);

      await transactionalEntityManager
        .createQueryBuilder()
        .relation(UserOrmEntity, 'roles')
        .of(savedUser.id)
        .remove(
          await transactionalEntityManager
            .createQueryBuilder()
            .relation(UserOrmEntity, 'roles')
            .of(savedUser.id)
            .loadMany(),
        );

      const rolesToAdd = await transactionalEntityManager.findBy(
        RoleOrmEntity,
        {
          id: In(roleIds),
        },
      );
      await transactionalEntityManager
        .createQueryBuilder()
        .relation(UserOrmEntity, 'roles')
        .of(savedUser.id)
        .add(rolesToAdd);

      await transactionalEntityManager
        .createQueryBuilder()
        .delete()
        .from(UserHasPermissionOrmEntity)
        .where('user_id = :userId', { userId: savedUser.id })
        .execute();

      const insertValues = permissionIds.map((permissionId) => ({
        user_id: savedUser.id,
        permission_id: permissionId,
      }));

      await transactionalEntityManager
        .createQueryBuilder()
        .insert()
        .into(UserHasPermissionOrmEntity)
        .values(insertValues)
        .execute();

      const updatedUser = await transactionalEntityManager.findOne(
        UserOrmEntity,
        {
          where: { id: savedUser.id },
          relations: ['roles', 'userHasPermissions'],
        },
      );

      return this._dataAccessMapper.toEntity(updatedUser!);
    });
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
