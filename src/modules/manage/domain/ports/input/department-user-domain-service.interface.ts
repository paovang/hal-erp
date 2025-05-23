import { ResponseResult } from '@src/common/application/interfaces/pagination.interface';
import { CreateDepartmentUserDto } from '@src/modules/manage/application/dto/create/departmentUser/create.dto';
import { EntityManager } from 'typeorm';
import { DepartmentUserEntity } from '../../entities/department-user.entity';
import { DepartmentUserQueryDto } from '@src/modules/manage/application/dto/query/department-user-query.dto';

export interface IDepartmentUserServiceInterface {
  create(
    dto: CreateDepartmentUserDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<DepartmentUserEntity>>;

  getAll(
    dto: DepartmentUserQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<DepartmentUserEntity>>;

  //   getOne(
  //     id: number,
  //     manager?: EntityManager,
  //   ): Promise<ResponseResult<DepartmentUserEntity>>;

  //   update(
  //     id: number,
  //     dto: UpdateDocumentTypeDto,
  //     manager?: EntityManager,
  //   ): Promise<ResponseResult<DepartmentUserEntity>>;

  //   delete(id: number, manager?: EntityManager): Promise<void>;
}
