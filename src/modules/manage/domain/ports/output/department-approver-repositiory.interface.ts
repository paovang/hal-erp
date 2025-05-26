import { EntityManager } from 'typeorm';
import { DepartmentApproverEntity } from '../../entities/department-approver.entity';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { DepartmentApproverQueryDto } from '@src/modules/manage/application/dto/query/department-approver.dto';
import { DepartmentApproverId } from '../../value-objects/department-approver-id.vo';

export interface IWriteDepartmentApproverRepository {
  create(
    entity: DepartmentApproverEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<DepartmentApproverEntity>>;

  update(
    entity: DepartmentApproverEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<DepartmentApproverEntity>>;

  delete(id: DepartmentApproverId, manager: EntityManager): Promise<void>;
}

export interface IReadDepartmentApproverRepository {
  findAll(
    query: DepartmentApproverQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<DepartmentApproverEntity>>;

  findOne(
    id: DepartmentApproverId,
    manager: EntityManager,
  ): Promise<ResponseResult<DepartmentApproverEntity>>;
}
