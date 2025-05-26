import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CreateDepartmentApproverDto } from '@src/modules/manage/application/dto/create/departmentApprover/create.dto';
import { EntityManager } from 'typeorm';
import { DepartmentApproverEntity } from '../../entities/department-approver.entity';
import { DepartmentApproverQueryDto } from '@src/modules/manage/application/dto/query/department-approver.dto';
import { UpdateDepartmentApproverDto } from '@src/modules/manage/application/dto/create/departmentApprover/update.dto';

export interface IDepartmentApproverServiceInterface {
  getAll(
    dto: DepartmentApproverQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<DepartmentApproverEntity>>;

  getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<DepartmentApproverEntity>>;

  create(
    dto: CreateDepartmentApproverDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<DepartmentApproverEntity>>;

  update(
    id: number,
    dto: UpdateDepartmentApproverDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<DepartmentApproverEntity>>;

  delete(id: number, manager?: EntityManager): Promise<void>;
}
