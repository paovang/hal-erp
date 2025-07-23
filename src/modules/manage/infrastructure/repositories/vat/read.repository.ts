import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { PAGINATION_SERVICE } from '@src/common/constants/inject-key.const';
import { EntityManager, Repository } from 'typeorm';
import {
  // FilterOptions,
  // IPaginationService,
  ResponseResult,
} from '@common/infrastructure/pagination/pagination.interface';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { IReadVatRepository } from '@src/modules/manage/domain/ports/output/vat-repository.interface';
import { VatOrmEntity } from '@src/common/infrastructure/database/typeorm/vat.orm';
import { VatQueryDto } from '@src/modules/manage/application/dto/query/vat-query.dto';
import { VatDataAccessMapper } from '../../mappers/vat.mapper';
import { VatEntity } from '@src/modules/manage/domain/entities/vat.entity';
import { VatId } from '@src/modules/manage/domain/value-objects/vat-id.vo';

@Injectable()
export class ReadVatRepository implements IReadVatRepository {
  constructor(
    @InjectRepository(VatOrmEntity)
    private readonly _orm: Repository<VatOrmEntity>,
    private readonly _dataAccessMapper: VatDataAccessMapper,
    // @Inject(PAGINATION_SERVICE)
    // private readonly _paginationService: IPaginationService,
  ) {}
  async findAll(
    query: VatQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<VatEntity>> {
    const queryBuilder = this.createBaseQuery(manager);

    // Get the first item without pagination
    const item = await queryBuilder.getOne();

    if (!item) {
      throw new Error('VAT item not found');
    }

    return this._dataAccessMapper.toEntity(item);
  }

  private createBaseQuery(manager: EntityManager) {
    return manager.createQueryBuilder(VatOrmEntity, 'vats');
  }

  // private getFilterOptions(): FilterOptions {
  //   return {
  //     searchColumns: ['vats.name'],
  //     dateColumn: '',
  //     filterByColumns: [],
  //   };
  // }

  async findOne(
    id: VatId,
    manager: EntityManager,
  ): Promise<ResponseResult<VatEntity>> {
    const item = await findOneOrFail(manager, VatOrmEntity, {
      id: id.value,
    });

    return this._dataAccessMapper.toEntity(item);
  }
}
