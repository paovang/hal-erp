import { EntityManager } from 'typeorm';
import { DepartmentUserEntity } from '../../entities/department-user.entity';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { DepartmentUserQueryDto } from '@src/modules/manage/application/dto/query/department-user-query.dto';
import { DepartmentUserId } from '../../value-objects/department-user-id.vo';
import { DepartmentId } from '../../value-objects/department-id.vo';

export interface IReadDepartmentUserRepository {
  findAll(
    query: DepartmentUserQueryDto,
    manager: EntityManager,
    departmentId?: number | null,
    userId?: number | null,
    roles?: string[],
  ): Promise<ResponseResult<DepartmentUserEntity>>;

  findOne(
    id: DepartmentUserId,
    manager: EntityManager,
  ): Promise<ResponseResult<DepartmentUserEntity>>;
  findAllByDepartment(
    department_id: DepartmentId,
    manager: EntityManager,
  ): Promise<ResponseResult<DepartmentUserEntity>>;
}

export interface IWriteDepartmentUserRepository {
  create(
    entity: DepartmentUserEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<DepartmentUserEntity>>;

  update(
    entity: DepartmentUserEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<DepartmentUserEntity>>;

  delete(id: DepartmentUserId, manager: EntityManager): Promise<void>;
}
