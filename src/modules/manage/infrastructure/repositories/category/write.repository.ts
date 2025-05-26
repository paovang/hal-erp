import { Injectable } from '@nestjs/common';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { CategoryEntity } from '@src/modules/manage/domain/entities/category.entity';
import { IWriteCategoryRepository } from '@src/modules/manage/domain/ports/output/category-repository.interface';
import { EntityManager, UpdateResult } from 'typeorm';
import { CategoryDataAccessMapper } from '../../mappers/category.mapper';
import { CategoryOrmEntity } from '@src/common/infrastructure/database/typeorm/category.orm';
import { CategoryId } from '@src/modules/manage/domain/value-objects/category-id.vo';

@Injectable()
export class WriteCategoryRepository implements IWriteCategoryRepository {
  constructor(private readonly _dataAccessMapper: CategoryDataAccessMapper) {}

  async create(
    entity: CategoryEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<CategoryEntity>> {
    return this._dataAccessMapper.toEntity(
      await manager.save(this._dataAccessMapper.toOrmEntity(entity)),
    );
  }

  async update(
    entity: CategoryEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<CategoryEntity>> {
    const userOrmEntity = this._dataAccessMapper.toOrmEntity(entity);

    try {
      await manager.update(
        CategoryOrmEntity,
        entity.getId().value,
        userOrmEntity,
      );

      return this._dataAccessMapper.toEntity(userOrmEntity);
    } catch (error) {
      throw error;
    }
  }

  async delete(id: CategoryId, manager: EntityManager): Promise<void> {
    try {
      const deletedUserOrmEntity: UpdateResult = await manager.softDelete(
        CategoryOrmEntity,
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
