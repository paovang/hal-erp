import { HttpStatus, Injectable } from '@nestjs/common';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { EntityManager, UpdateResult } from 'typeorm';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { IWriteUserTypeRepository } from '@src/modules/manage/domain/ports/output/user-type-repository.interface';
import { UserTypeDataAccessMapper } from '../../mappers/user-type.mapper';
import { UserTypeEntity } from '@src/modules/manage/domain/entities/user-type.entity';
import { UserTypeId } from '@src/modules/manage/domain/value-objects/user-type-id.vo';
import { UserTypeOrmEntity } from '@src/common/infrastructure/database/typeorm/user-type.orm';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';

@Injectable()
export class WriteUserTypeRepository implements IWriteUserTypeRepository {
  constructor(private readonly _dataAccessMapper: UserTypeDataAccessMapper) {}

  async create(
    entity: UserTypeEntity | UserTypeEntity[],
    manager: EntityManager,
  ): Promise<ResponseResult<UserTypeEntity | UserTypeEntity[]>> {
    // Handle array of entities
    if (Array.isArray(entity)) {
      const ormEntities = entity.map((singleEntity) =>
        this._dataAccessMapper.toOrmEntity(
          singleEntity,
          OrmEntityMethod.CREATE,
        ),
      );
      const savedEntities = await manager.save(ormEntities);
      return this._dataAccessMapper.toEntities(savedEntities);
    }

    // Handle single entity
    return this._dataAccessMapper.toEntity(
      await manager.save(
        this._dataAccessMapper.toOrmEntity(entity, OrmEntityMethod.CREATE),
      ),
    );
  }

  async update(
    entity: UserTypeEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<UserTypeEntity>> {
    const id = entity.getId().value;
    const ormEntity = this._dataAccessMapper.toOrmEntity(
      entity,
      OrmEntityMethod.UPDATE,
    );

    try {
      await manager.update(UserTypeOrmEntity, id, ormEntity);

      // Re-fetch the updated entity (optional but recommended)
      const updated = await manager.findOneByOrFail(UserTypeOrmEntity, {
        id,
      });

      return this._dataAccessMapper.toEntity(updated);
    } catch (error) {
      throw new ManageDomainException(
        'errors.internal_service_error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async delete(id: UserTypeId, manager: EntityManager): Promise<void> {
    try {
      const deletedUserOrmEntity: UpdateResult = await manager.softDelete(
        UserTypeOrmEntity,
        id.value,
      );
      if (deletedUserOrmEntity.affected === 0) {
        // throw new UserDomainException('users.not_found', HttpStatus.NOT_FOUND);
      }
      return;
    } catch (error) {
      throw error;
    }
  }
}
