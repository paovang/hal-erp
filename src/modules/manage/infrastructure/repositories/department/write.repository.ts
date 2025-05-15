import { Injectable } from '@nestjs/common';
import { IWriteDepartmentRepository } from '@src/modules/manage/domain/ports/output/department-repository.interface';
import { DepartmentDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/department.mapper';
import { ResponseResult } from '@src/common/application/interfaces/pagination.interface';
import { EntityManager } from 'typeorm';
import { DepartmentEntity } from '@src/modules/manage/domain/entities/department.entity';
import { Department } from '@src/common/infrastructure/database/typeorm/department.orm';

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
      await manager.update(Department, entity.getId().value, userOrmEntity);

      return this._dataAccessMapper.toEntity(userOrmEntity);
    } catch (error) {
      throw error;
    }
  }
}
