import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FilterOptions,
  IPaginationService,
  ResponseResult,
} from '@common/infrastructure/pagination/pagination.interface';
import { PAGINATION_SERVICE } from '@src/common/constants/inject-key.const';
import { PermissionQueryDto } from '@src/modules/manage/application/dto/query/permission-query.dto';
import { IReadPermissionRoleRepository } from '@src/modules/manage/domain/ports/output/permission-repository.interface';
import { EntityManager, Repository } from 'typeorm';
import { PermissionDataAccessMapper } from '../../../mappers/permission.mapper';
import { PermissionGroupOrmEntity } from '@src/common/infrastructure/database/typeorm/permission-group.orm';
import { PermissionGroupEntity } from '@src/modules/manage/domain/entities/permission-group.entity';
import { PermissionGroupId } from '@src/modules/manage/domain/value-objects/permission-group-id.vo';

@Injectable()
export class ReadPermissionRepository implements IReadPermissionRoleRepository {
  constructor(
    @InjectRepository(PermissionGroupOrmEntity)
    private readonly _permissionOrm: Repository<PermissionGroupOrmEntity>,
    private readonly _dataAccessMapper: PermissionDataAccessMapper,
    @Inject(PAGINATION_SERVICE)
    private readonly _paginationService: IPaginationService,
  ) {}

  async findAll(
    query: PermissionQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<PermissionGroupEntity>> {
    const queryBuilder = await this.createBaseQuery(manager);
    query.sort_by = 'permission_groups.id';

    const data = await this._paginationService.paginate(
      queryBuilder,
      query,
      this._dataAccessMapper.toEntity.bind(this._dataAccessMapper),
      this.getFilterOptions(),
    );
    return data;
  }

  async findOne(
    id: PermissionGroupId,
    manager: EntityManager,
  ): Promise<ResponseResult<PermissionGroupEntity>> {
    const item = await manager
      .createQueryBuilder(PermissionGroupOrmEntity, 'permission_groups')
      .leftJoinAndSelect('permission_groups.permissions', 'permissions')
      .where('permission_groups.id = :id', { id: id.value })
      .getOneOrFail();

    return this._dataAccessMapper.toEntity(item);
  }

  private createBaseQuery(manager: EntityManager) {
    return manager
      .createQueryBuilder(PermissionGroupOrmEntity, 'permission_groups')
      .leftJoinAndSelect('permission_groups.permissions', 'permissions');
  }

  private getFilterOptions(): FilterOptions {
    return {
      searchColumns: [
        'permission_groups.name',
        'permissions.name',
        'permission_groups.display_name',
      ],
      dateColumn: '',
      filterByColumns: [],
    };
  }
}
