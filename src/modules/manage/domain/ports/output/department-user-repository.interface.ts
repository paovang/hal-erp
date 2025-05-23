import { EntityManager } from 'typeorm';
import { DepartmentUserEntity } from '../../entities/department-user.entity';
import { ResponseResult } from '@src/common/application/interfaces/pagination.interface';
import { DepartmentUserQueryDto } from '@src/modules/manage/application/dto/query/department-user-query.dto';

export interface IReadDepartmentUserRepository {
  findAll(
    query: DepartmentUserQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<DepartmentUserEntity>>;

  // findOne(
  //   id: DepartmentId,
  //   manager: EntityManager,
  // ): Promise<ResponseResult<DepartmentEntity>>;
}

export interface IWriteDepartmentUserRepository {
  create(
    entity: DepartmentUserEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<DepartmentUserEntity>>;

  //   update(
  //     entity: DepartmentEntity,
  //     manager: EntityManager,
  //   ): Promise<ResponseResult<DepartmentEntity>>;

  //   delete(id: DepartmentId, manager: EntityManager): Promise<void>;
}
