import { ResponseResult } from '@src/common/application/interfaces/pagination.interface';
import { DepartmentQueryDto } from '@src/modules/manage/application/dto/query/department-query.dto';
import { EntityManager } from 'typeorm';
import { DepartmentEntity } from '@src/modules/manage/domain/entities/department.entity';
import { DepartmentId } from '@src/modules/manage/domain/value-objects/department-id.vo';

export interface IReadDepartmentRepository {
  findAll(
    query: DepartmentQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<DepartmentEntity>>;

  findOne(
    id: DepartmentId,
    manager: EntityManager,
  ): Promise<ResponseResult<DepartmentEntity>>;
}

export interface IWriteDepartmentRepository {
  create(
    entity: DepartmentEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<DepartmentEntity>>;

  update(
    entity: DepartmentEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<DepartmentEntity>>;

  delete(id: DepartmentId, manager: EntityManager): Promise<void>;
}
