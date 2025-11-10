import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DepartmentOrmEntity } from '@src/common/infrastructure/database/typeorm/department.orm';
import { IReadDepartmentRepository } from '@src/modules/manage/domain/ports/output/department-repository.interface';
import { DepartmentDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/department.mapper';
import { DepartmentQueryDto } from '@src/modules/manage/application/dto/query/department-query.dto';
import {
  FilterOptions,
  IPaginationService,
  ResponseResult,
} from '@common/infrastructure/pagination/pagination.interface';
import { PAGINATION_SERVICE } from '@src/common/constants/inject-key.const';
import { EntityManager } from 'typeorm';
import { DepartmentEntity } from '@src/modules/manage/domain/entities/department.entity';
import { DepartmentId } from '@src/modules/manage/domain/value-objects/department-id.vo';
import { EligiblePersons } from '@src/modules/manage/application/constants/status-key.const';

@Injectable()
export class ReadDepartmentRepository implements IReadDepartmentRepository {
  constructor(
    private readonly _dataAccessMapper: DepartmentDataAccessMapper,
    @Inject(PAGINATION_SERVICE)
    private readonly _paginationService: IPaginationService,
  ) {}

  async findAll(
    query: DepartmentQueryDto,
    manager: EntityManager,
    company_id?: number,
    roles?: string[],
  ): Promise<ResponseResult<DepartmentEntity>> {
    const queryBuilder = await this.createBaseQuery(manager);
    query.sort_by = 'departments.id';

    if (
      roles &&
      !roles.includes(EligiblePersons.SUPER_ADMIN) &&
      !roles.includes(EligiblePersons.ADMIN)
    ) {
      if (company_id) {
        queryBuilder.where('departments.company_id = :company_id', {
          company_id,
        });
      }
    }

    const data = await this._paginationService.paginate(
      queryBuilder,
      query,
      this._dataAccessMapper.toEntity.bind(this._dataAccessMapper),
      this.getFilterOptions(),
    );
    if (!data) {
      throw new NotFoundException('No departments found.');
    }
    return data;
  }

  async findOne(
    id: DepartmentId,
    manager: EntityManager,
  ): Promise<ResponseResult<DepartmentEntity>> {
    // const item = await findOneOrFail(manager, DepartmentOrmEntity, {
    //   id: id.value,
    // });

    const item = await this.createBaseQuery(manager)
      .where('departments.id = :id', { id: id.value })
      .getOneOrFail();

    return this._dataAccessMapper.toEntity(item);
  }

  private createBaseQuery(manager: EntityManager) {
    return manager
      .createQueryBuilder(DepartmentOrmEntity, 'departments')
      .leftJoinAndSelect('departments.company', 'company')
      .leftJoinAndSelect('departments.users', 'users');
  }

  private getFilterOptions(): FilterOptions {
    return {
      searchColumns: ['departments.code', 'departments.name'],
      dateColumn: '',
      filterByColumns: [],
    };
  }
}
