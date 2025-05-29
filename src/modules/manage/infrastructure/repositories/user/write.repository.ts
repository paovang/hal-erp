import { Injectable } from '@nestjs/common';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { UserEntity } from '@src/modules/manage/domain/entities/user.entity';
import { IWriteUserRepository } from '@src/modules/manage/domain/ports/output/user-repository.interface';
import { EntityManager } from 'typeorm';
import { UserDataAccessMapper } from '../../mappers/user.mapper';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorm/user.orm';
import { UserId } from '@src/modules/manage/domain/value-objects/user-id.vo';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';

@Injectable()
export class WriteUserRepository implements IWriteUserRepository {
  constructor(private readonly _dataAccessMapper: UserDataAccessMapper) {}

  async create(
    entity: UserEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<UserEntity>> {
    return this._dataAccessMapper.toEntity(
      await manager.save(
        this._dataAccessMapper.toOrmEntity(entity, OrmEntityMethod.CREATE),
      ),
    );
  }

  async update(
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
