import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FilterOptions,
  IPaginationService,
  ResponseResult,
} from '@common/infrastructure/pagination/pagination.interface';
import { PAGINATION_SERVICE } from '@src/common/constants/inject-key.const';
import { RoleOrmEntity } from '@src/common/infrastructure/database/typeorm/role.orm';
import { IReadRoleRepository } from '@src/modules/manage/domain/ports/output/role-repository.interface';
import { EntityManager, Repository } from 'typeorm';
import { RoleDataAccessMapper } from '../../../mappers/role.mapper';
import { RoleQueryDto } from '@src/modules/manage/application/dto/query/role-query.dto';
import { RoleEntity } from '@src/modules/manage/domain/entities/role.entity';
import { RoleId } from '@src/modules/manage/domain/value-objects/role-id.vo';

@Injectable()
export class ReadRoleRepository implements IReadRoleRepository {
  constructor(
    @InjectRepository(RoleOrmEntity)
    private readonly _userOrm: Repository<RoleOrmEntity>,
    private readonly _dataAccessMapper: RoleDataAccessMapper,
    @Inject(PAGINATION_SERVICE)
    private readonly _paginationService: IPaginationService,
  ) {}

  async findAll(
    query: RoleQueryDto,
    manager: EntityManager,
    roles?: string[],
  ): Promise<ResponseResult<RoleEntity>> {
    const department_id = Number(query.department_id);
    const companyId = Number(query.company_id);
    const queryBuilder = await this.createBaseQuery(
      manager,
      department_id,
      roles,
      companyId,
    );
    query.sort_by = 'roles.id';

    const data = await this._paginationService.paginate(
      queryBuilder,
      query,
      this._dataAccessMapper.toEntity.bind(this._dataAccessMapper),
      this.getFilterOptions(),
    );
    return data;
  }

  async findOne(
    id: RoleId,
    manager: EntityManager,
  ): Promise<ResponseResult<RoleEntity>> {
    const item = await this.createBaseQuery(manager)
      .where('roles.id = :id', { id: id.value })
      .getOneOrFail();

    return this._dataAccessMapper.toEntity(item);
  }

  private createBaseQuery(
    manager: EntityManager,
    department_id?: number,
    roles?: string[],
    companyId?: number,
  ) {
    const roleName = ['super-admin', 'admin', 'company-admin'];
    const queryBuilder = manager
      .createQueryBuilder(RoleOrmEntity, 'roles')
      .leftJoin('roles.rolesGroups', 'roleGroups') // use rolesGroups (matches entity)
      .leftJoin('roleGroups.department', 'departments') // use the alias roleGroups here
      .leftJoinAndSelect('roles.permissions', 'permissions')
      .where('roles.name NOT IN (:...roleName)', { roleName })
      .addSelect([
        'roleGroups.id',
        'roleGroups.role_id',
        'roleGroups.department_id',
        'departments.id',
        'departments.name',
        'departments.code',
        'departments.company_id',
      ]);

    if (companyId) {
      queryBuilder.andWhere('departments.company_id = :companyId', {
        companyId,
      });
    }

    if (department_id) {
      queryBuilder.andWhere('departments.id = :department_id', {
        department_id,
      });
    }

    return queryBuilder;
  }

  async findAllForCompany(
    query: RoleQueryDto,
    manager: EntityManager,
    roles?: string[],
    company_id?: number,
  ): Promise<ResponseResult<RoleEntity>> {
    const department_id = Number(query.department_id);
    const queryBuilder = await this.createBaseQueryForCompany(
      manager,
      department_id,
      company_id,
    );
    query.sort_by = 'roles.id';

    const data = await this._paginationService.paginate(
      queryBuilder,
      query,
      this._dataAccessMapper.toEntity.bind(this._dataAccessMapper),
      this.getFilterOptions(),
    );
    return data;
  }

  private createBaseQueryForCompany(
    manager: EntityManager,
    department_id?: number,
    company_id?: number,
  ) {
    const roleName = ['super-admin', 'admin', 'company-admin'];
    const queryBuilder = manager
      .createQueryBuilder(RoleOrmEntity, 'roles')
      .leftJoin('roles.rolesGroups', 'roleGroups') // use rolesGroups (matches entity)
      .leftJoin('roleGroups.department', 'departments') // use the alias roleGroups here
      .leftJoinAndSelect('roles.permissions', 'permissions')
      .where('roles.name NOT IN (:...roleName)', { roleName })
      // .andWhere('roleGroups.id IS NOT NULL')
      .addSelect([
        'roleGroups.id',
        'roleGroups.role_id',
        'roleGroups.department_id',
        'departments.id',
        'departments.name',
        'departments.code',
        'departments.company_id',
      ]);

    console.log('object', company_id);
    if (company_id) {
      queryBuilder.andWhere('departments.company_id = :company_id', {
        company_id,
      });
    }

    if (department_id) {
      queryBuilder.andWhere('departments.id = :department_id', {
        department_id,
      });
    }

    return queryBuilder;
  }

  private getFilterOptions(): FilterOptions {
    return {
      searchColumns: ['roles.name'],
      dateColumn: '',
      filterByColumns: [],
    };
  }
}
