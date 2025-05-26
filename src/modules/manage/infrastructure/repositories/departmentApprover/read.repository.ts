import { Inject, Injectable } from '@nestjs/common';
import { PAGINATION_SERVICE } from '@src/common/constants/inject-key.const';
import { DepartmentApproverOrmEntity } from '@src/common/infrastructure/database/typeorm/department-approver.orm';
import {
  FilterOptions,
  IPaginationService,
  ResponseResult,
} from '@src/common/infrastructure/pagination/pagination.interface';
import { DepartmentApproverQueryDto } from '@src/modules/manage/application/dto/query/department-approver.dto';
import { DepartmentApproverEntity } from '@src/modules/manage/domain/entities/department-approver.entity';
import { IReadDepartmentApproverRepository } from '@src/modules/manage/domain/ports/output/department-approver-repositiory.interface';
import { EntityManager } from 'typeorm';
import { DepartmentApproverDataAccessMapper } from '../../mappers/department-approver.mapper';
import { DepartmentApproverId } from '../../../domain/value-objects/department-approver-id.vo';

@Injectable()
export class ReadDepartmentApproverRepository
  implements IReadDepartmentApproverRepository
{
  constructor(
    private readonly _dataAccessMapper: DepartmentApproverDataAccessMapper,
    @Inject(PAGINATION_SERVICE)
    private readonly _paginationService: IPaginationService,
  ) {}

  async findAll(
    query: DepartmentApproverQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<DepartmentApproverEntity>> {
    const queryBuilder = await this.createBaseQuery(manager);
    query.sort_by = 'department_approvers.id';

    const data = await this._paginationService.paginate(
      queryBuilder,
      query,
      this._dataAccessMapper.toEntity.bind(this._dataAccessMapper),
      this.getFilterOptions(),
    );
    return data;
  }

  private createBaseQuery(manager: EntityManager) {
    return manager
      .createQueryBuilder(DepartmentApproverOrmEntity, 'department_approvers')
      .leftJoinAndSelect('department_approvers.departments', 'departments')
      .leftJoinAndSelect('department_approvers.users', 'users');
  }

  private getFilterOptions(): FilterOptions {
    return {
      searchColumns: [
        'users.username',
        'users.email',
        'users.tel',
        'departments.name',
      ],
      dateColumn: '',
      filterByColumns: [],
    };
  }

  async findOne(
    id: DepartmentApproverId,
    manager: EntityManager,
  ): Promise<ResponseResult<DepartmentApproverEntity>> {
    const item = await this.createBaseQuery(manager)
      .where('department_approvers.id = :id', { id: id.value })
      .getOneOrFail();

    return this._dataAccessMapper.toEntity(item);
  }
}
