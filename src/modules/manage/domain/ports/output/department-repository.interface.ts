import { ResponseResult } from '@src/common/application/interfaces/pagination.interface';
import { DepartmentQueryDto } from '@src/modules/manage/application/dto/query/department-query.dto';
import { EntityManager } from 'typeorm';
import { DepartmentEntity } from '@src/modules/manage/domain/entities/department.entity';

export interface IReadDepartmentRepository {
  findAll(
    query: DepartmentQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<DepartmentEntity>>;
}
