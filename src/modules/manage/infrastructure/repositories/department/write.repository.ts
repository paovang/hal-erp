import { Injectable } from '@nestjs/common';
import { IWriteDepartmentRepository } from '@src/modules/manage/domain/ports/output/department-repository.interface';
import { DepartmentDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/department.mapper';
import { ResponseResult } from '@src/common/application/interfaces/pagination.interface';
import { EntityManager, UpdateResult } from 'typeorm';
import { DepartmentEntity } from '@src/modules/manage/domain/entities/department.entity';
import { DepartmentOrmEntity } from '@src/common/infrastructure/database/typeorm/department.orm';
import { DepartmentId } from '@src/modules/manage/domain/value-objects/department-id.vo';

@Injectable()
export class WriteDepartmentRepository implements IWriteDepartmentRepository {
  constructor(private readonly _dataAccessMapper: DepartmentDataAccessMapper) {}

  async create(
    entity: DepartmentEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<DepartmentEntity>> {
    return this._dataAccessMapper.toEntity(
      await manager.save(this._dataAccessMapper.toOrmEntity(entity)),
    );
  }

  async update(
    entity: DepartmentEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<DepartmentEntity>> {
    const userOrmEntity = this._dataAccessMapper.toOrmEntity(entity);

    try {
      await manager.update(
        DepartmentOrmEntity,
        entity.getId().value,
        userOrmEntity,
      );

      return this._dataAccessMapper.toEntity(userOrmEntity);
    } catch (error) {
      throw error;
    }
  }

  async delete(id: DepartmentId, manager: EntityManager): Promise<void> {
    try {
      const deletedUserOrmEntity: UpdateResult = await manager.softDelete(
        DepartmentOrmEntity,
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
