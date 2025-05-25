import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DepartmentUserOrmEntity } from '@src/common/infrastructure/database/typeorm/department-user.orm';
import { IReadDepartmentUserRepository } from '@src/modules/manage/domain/ports/output/department-user-repository.interface';
import { EntityManager, Repository } from 'typeorm';
import { DepartmentUserDataAccessMapper } from '../../mappers/department-user.mapper';
import { PAGINATION_SERVICE } from '@src/common/constants/inject-key.const';
import {
  FilterOptions,
  IPaginationService,
  ResponseResult,
} from '@src/common/application/interfaces/pagination.interface';
import { DepartmentUserQueryDto } from '@src/modules/manage/application/dto/query/department-user-query.dto';
import { DepartmentUserEntity } from '@src/modules/manage/domain/entities/department-user.entity';
import { DepartmentUserId } from '@src/modules/manage/domain/value-objects/department-user-id.vo';

@Injectable()
export class ReadDepartmentUserRepository
  implements IReadDepartmentUserRepository
{
  constructor(
    @InjectRepository(DepartmentUserOrmEntity)
    private readonly _departmentUserOrm: Repository<DepartmentUserOrmEntity>,
    private readonly _dataAccessMapper: DepartmentUserDataAccessMapper,
    @Inject(PAGINATION_SERVICE)
    private readonly _paginationService: IPaginationService,
  ) {}

  async findAll(
    query: DepartmentUserQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<DepartmentUserEntity>> {
    const queryBuilder = await this.createBaseQuery(manager).where(
      'department_users.department_id = :departmentId',
      {
        departmentId: 1,
      },
    );
    query.sort_by = 'department_users.id';

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
      .createQueryBuilder(DepartmentUserOrmEntity, 'department_users')
      .leftJoinAndSelect('department_users.departments', 'departments')
      .leftJoinAndSelect('department_users.users', 'users') // assuming relation name is `user`
      .leftJoinAndSelect('department_users.positions', 'positions');
  }

  private getFilterOptions(): FilterOptions {
    return {
      searchColumns: ['', ''],
      dateColumn: '',
      filterByColumns: [],
    };
  }

  async findOne(
    id: DepartmentUserId,
    manager: EntityManager,
  ): Promise<ResponseResult<DepartmentUserEntity>> {
    const item = await this.createBaseQuery(manager)
      .where('department_users.id = :id', { id: id.value })
      .getOneOrFail();

    return this._dataAccessMapper.toEntity(item);
  }
}
