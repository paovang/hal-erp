import { ResponseResult } from '@src/common/application/interfaces/pagination.interface';
import { DepartmentQueryDto } from '@src/modules/manage/application/dto/query/department-query.dto';
import { EntityManager } from 'typeorm';
import { DepartmentEntity } from '@src/modules/manage/domain/entities/department.entity';
import { CreateDepartmentDto } from '@src/modules/manage/application/dto/create/department/create.dto';
import { UpdateDepartmentDto } from '@src/modules/manage/application/dto/create/department/update.dto';

export interface IDepartmentServiceInterface {
  getAll(
    dto: DepartmentQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<DepartmentEntity>>;

  getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<DepartmentEntity>>;

  create(
    dto: CreateDepartmentDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<DepartmentEntity>>;

  update(
    id: number,
    dto: UpdateDepartmentDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<DepartmentEntity>>;

  delete(id: number, manager?: EntityManager): Promise<void>;
}
