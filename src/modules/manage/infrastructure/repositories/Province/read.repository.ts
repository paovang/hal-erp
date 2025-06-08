import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProvinceOrmEntity } from '@src/common/infrastructure/database/typeorm/province.orm';
import { IReadProvinceRepository } from '@src/modules/manage/domain/ports/output/province-repository.interface';
import { EntityManager, Repository } from 'typeorm';
import { ProvinceDataAccessMapper } from '../../mappers/province.mapper';
import { PAGINATION_SERVICE } from '@src/common/constants/inject-key.const';
import {
  FilterOptions,
  IPaginationService,
  ResponseResult,
} from '@src/common/infrastructure/pagination/pagination.interface';
import { ProvinceQueryDto } from '@src/modules/manage/application/dto/query/province.dto';
import { ProvinceEntity } from '@src/modules/manage/domain/entities/province.entity';

@Injectable()
export class ReadProvinceRepository implements IReadProvinceRepository {
  constructor(
    @InjectRepository(ProvinceOrmEntity)
    private readonly _positionOrm: Repository<ProvinceOrmEntity>,
    private readonly _dataAccessMapper: ProvinceDataAccessMapper,
    @Inject(PAGINATION_SERVICE)
    private readonly _paginationService: IPaginationService,
  ) {}
  async findAll(
    query: ProvinceQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<ProvinceEntity>> {
    const queryBuilder = await this.createBaseQuery(manager);
    query.sort_by = 'provinces.id';

    const data = await this._paginationService.paginate(
      queryBuilder,
      query,
      this._dataAccessMapper.toEntity.bind(this._dataAccessMapper),
      this.getFilterOptions(),
    );
    return data;
  }

  private createBaseQuery(manager: EntityManager) {
    return manager.createQueryBuilder(ProvinceOrmEntity, 'provinces');
  }

  private getFilterOptions(): FilterOptions {
    return {
      searchColumns: ['provinces.name'],
      dateColumn: '',
      filterByColumns: [],
    };
  }
}
