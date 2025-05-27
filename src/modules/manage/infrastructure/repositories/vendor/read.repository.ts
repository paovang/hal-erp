import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PAGINATION_SERVICE } from '@src/common/constants/inject-key.const';
import { VendorOrmEntity } from '@src/common/infrastructure/database/typeorm/vendor.orm';
import {
  FilterOptions,
  IPaginationService,
  ResponseResult,
} from '@src/common/infrastructure/pagination/pagination.interface';
import { VendorQueryDto } from '@src/modules/manage/application/dto/query/vendor-query.dto';
import { VendorEntity } from '@src/modules/manage/domain/entities/vendor.entity';
import { IReadVendorRepository } from '@src/modules/manage/domain/ports/output/vendor-repository.interface';
import { EntityManager, Repository } from 'typeorm';
import { VendorDataAccessMapper } from '../../mappers/vendor.mapper';
import { VendorId } from '@src/modules/manage/domain/value-objects/vendor-id.vo';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';

@Injectable()
export class ReadVendorRepository implements IReadVendorRepository {
  constructor(
    @InjectRepository(VendorOrmEntity)
    private readonly _vendorOrm: Repository<VendorOrmEntity>,
    private readonly _dataAccessMapper: VendorDataAccessMapper,
    @Inject(PAGINATION_SERVICE)
    private readonly _paginationService: IPaginationService,
  ) {}
  async findAll(
    query: VendorQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<VendorEntity>> {
    const queryBuilder = await this.createBaseQuery(manager);
    query.sort_by = 'vendors.id';

    const data = await this._paginationService.paginate(
      queryBuilder,
      query,
      this._dataAccessMapper.toEntity.bind(this._dataAccessMapper),
      this.getFilterOptions(),
    );
    return data;
  }

  private createBaseQuery(manager: EntityManager) {
    return manager.createQueryBuilder(VendorOrmEntity, 'vendors');
  }

  private getFilterOptions(): FilterOptions {
    return {
      searchColumns: ['vendors.name', 'vendors.contact_info'],
      dateColumn: '',
      filterByColumns: [],
    };
  }

  async findOne(
    id: VendorId,
    manager: EntityManager,
  ): Promise<ResponseResult<VendorEntity>> {
    const item = await findOneOrFail(manager, VendorOrmEntity, {
      id: id.value,
    });

    return this._dataAccessMapper.toEntity(item);
  }
}
