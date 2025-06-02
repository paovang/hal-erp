import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorm/user.orm';
import { IReadUserRepository } from '@src/modules/manage/domain/ports/output/user-repository.interface';
import { EntityManager, Repository } from 'typeorm';
import { UserDataAccessMapper } from '../../mappers/user.mapper';
import { PAGINATION_SERVICE } from '@src/common/constants/inject-key.const';
import {
  FilterOptions,
  IPaginationService,
  ResponseResult,
} from '@common/infrastructure/pagination/pagination.interface';
import { UserQueryDto } from '@src/modules/manage/application/dto/query/user-query.dto';
import { UserEntity } from '@src/modules/manage/domain/entities/user.entity';
import { UserId } from '@src/modules/manage/domain/value-objects/user-id.vo';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';

@Injectable()
export class ReadUserRepository implements IReadUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly _userOrm: Repository<UserOrmEntity>,
    private readonly _dataAccessMapper: UserDataAccessMapper,
    @Inject(PAGINATION_SERVICE)
    private readonly _paginationService: IPaginationService,
  ) {}
  async findAll(
    query: UserQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<UserEntity>> {
    const queryBuilder = await this.createBaseQuery(manager);
    query.sort_by = 'users.id';

    const data = await this._paginationService.paginate(
      queryBuilder,
      query,
      this._dataAccessMapper.toEntity.bind(this._dataAccessMapper),
      this.getFilterOptions(),
    );
    return data;
  }

  async findOne(
    id: UserId,
    manager: EntityManager,
  ): Promise<ResponseResult<UserEntity>> {
    const item = await findOneOrFail(manager, UserOrmEntity, {
      id: id.value,
    });

    return this._dataAccessMapper.toEntity(item);
  }

  private createBaseQuery(manager: EntityManager) {
    return manager
      .createQueryBuilder(UserOrmEntity, 'users')
      .leftJoinAndSelect('users.roles', 'roles')
      .leftJoinAndSelect('roles.permissions', 'permissions');
  }

  private getFilterOptions(): FilterOptions {
    return {
      searchColumns: ['users.username', 'users.email', 'users.tel'],
      dateColumn: '',
      filterByColumns: [],
    };
  }
}
