import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FilterOptions,
  IPaginationService,
  ResponseResult,
} from '@src/common/application/interfaces/pagination.interface';
import { PAGINATION_SERVICE } from '@src/common/constants/inject-key.const';
import { PositionOrmEntity } from '@src/common/infrastructure/database/typeorm/position.orm';
import { PositionQueryDto } from '@src/modules/manage/application/dto/query/position-query.dto';
import { PositionEntity } from '@src/modules/manage/domain/entities/position.entity';
import { IReadPositionRepository } from '@src/modules/manage/domain/ports/output/position-repository.interface';
import { EntityManager, Repository } from 'typeorm';
import { PositionDataAccessMapper } from '../../mappers/position.mapper';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { PositionId } from '@src/modules/manage/domain/value-objects/position-id.vo';

@Injectable()
export class ReadPositionRepository implements IReadPositionRepository {
  constructor(
    @InjectRepository(PositionOrmEntity)
    private readonly _positionOrm: Repository<PositionOrmEntity>,
    private readonly _dataAccessMapper: PositionDataAccessMapper,
    @Inject(PAGINATION_SERVICE)
    private readonly _paginationService: IPaginationService,
  ) {}
  async findAll(
    query: PositionQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<PositionEntity>> {
    const queryBuilder = await this.createBaseQuery(manager);
    query.sort_by = 'positions.id';

    const data = await this._paginationService.paginate(
      queryBuilder,
      query,
      this._dataAccessMapper.toEntity.bind(this._dataAccessMapper),
      this.getFilterOptions(),
    );
    return data;
  }

  private createBaseQuery(manager: EntityManager) {
    return manager.createQueryBuilder(PositionOrmEntity, 'positions');
  }

  private getFilterOptions(): FilterOptions {
    return {
      searchColumns: ['positions.name'],
      dateColumn: '',
      filterByColumns: [],
    };
  }

  async findOne(
    id: PositionId,
    manager: EntityManager,
  ): Promise<ResponseResult<PositionEntity>> {
    const item = await findOneOrFail(manager, PositionOrmEntity, {
      id: id.value,
    });

    return this._dataAccessMapper.toEntity(item);
  }
}
