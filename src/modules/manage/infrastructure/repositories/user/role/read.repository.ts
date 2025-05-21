import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FilterOptions, IPaginationService, ResponseResult } from "@src/common/application/interfaces/pagination.interface";
import { PAGINATION_SERVICE } from "@src/common/constants/inject-key.const";
import { RoleOrmEntity } from "@src/common/infrastructure/database/typeorm/role.orm";
import { IReadRoleRepository } from "@src/modules/manage/domain/ports/output/role-repository.interface";
import { EntityManager, Repository } from "typeorm";
import { RoleDataAccessMapper } from "../../../mappers/role.mapper";
import { RoleQueryDto } from "@src/modules/manage/application/dto/query/role-query.dto";
import { RoleEntity } from "@src/modules/manage/domain/entities/role.entity";
import { RoleId } from "@src/modules/manage/domain/value-objects/role-id.vo";
import { findOneOrFail } from "@src/common/utils/fine-one-orm.utils";

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
    ): Promise<ResponseResult<RoleEntity>> {
            const queryBuilder = await this.createBaseQuery(manager);
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
        const item = await findOneOrFail(manager, RoleOrmEntity, {
            id: id.value,
        });

        return this._dataAccessMapper.toEntity(item);
    }

    private createBaseQuery(manager: EntityManager) {
        return manager.createQueryBuilder(RoleOrmEntity, 'roles');
    }

    private getFilterOptions(): FilterOptions {
        return {
            searchColumns: ['roles.name'],
            dateColumn: '',
            filterByColumns: [],
        };
    }
}