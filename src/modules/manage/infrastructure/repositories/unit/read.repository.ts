import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PAGINATION_SERVICE } from '@src/common/constants/inject-key.const';
import { UnitOrmEntity } from '@src/common/infrastructure/database/typeorm/unit.orm';
import { IReadUnitRepository } from '@src/modules/manage/domain/ports/output/unit-repository.interface';
import { EntityManager, Repository } from 'typeorm';
import { UnitDataAccessMapper } from '../../mappers/unit.mapper';
import {
  FilterOptions,
  IPaginationService,
  ResponseResult,
} from '@src/common/application/interfaces/pagination.interface';
import { UnitQueryDto } from '@src/modules/manage/application/dto/query/unit-query.dto';
import { UnitEntity } from '@src/modules/manage/domain/entities/unit.entity';
import { UnitId } from '@src/modules/manage/domain/value-objects/unit-id.vo';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';

@Injectable()
export class ReadUnitRepository implements IReadUnitRepository {
  constructor(
    @InjectRepository(UnitOrmEntity)
    private readonly _unitOrm: Repository<UnitOrmEntity>,
    private readonly _dataAccessMapper: UnitDataAccessMapper,
    @Inject(PAGINATION_SERVICE)
    private readonly _paginationService: IPaginationService,
  ) {}
  async findAll(
    query: UnitQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<UnitEntity>> {
    const queryBuilder = await this.createBaseQuery(manager);
    query.sort_by = 'units.id';

    const data = await this._paginationService.paginate(
      queryBuilder,
      query,
      this._dataAccessMapper.toEntity.bind(this._dataAccessMapper),
      this.getFilterOptions(),
    );
    return data;
  }

  private createBaseQuery(manager: EntityManager) {
    return manager.createQueryBuilder(UnitOrmEntity, 'units');
  }

  private getFilterOptions(): FilterOptions {
    return {
      searchColumns: ['units.name'],
      dateColumn: '',
      filterByColumns: [],
    };
  }

  async findOne(
    id: UnitId,
    manager: EntityManager,
  ): Promise<ResponseResult<UnitEntity>> {
    const item = await findOneOrFail(manager, UnitOrmEntity, {
      id: id.value,
    });

    return this._dataAccessMapper.toEntity(item);
  }
}
