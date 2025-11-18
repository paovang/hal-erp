import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PAGINATION_SERVICE } from '@src/common/constants/inject-key.const';
import { QuotaCompanyOrmEntity } from '@src/common/infrastructure/database/typeorm/quota-company.orm';
import { IReadQuotaCompanyRepository } from '@src/modules/manage/domain/ports/output/quota-company-repository.interface';
import { EntityManager, Repository } from 'typeorm';
import {
  FilterOptions,
  IPaginationService,
  ResponseResult,
} from '@common/infrastructure/pagination/pagination.interface';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { QuotaCompanyEntity } from '@src/modules/manage/domain/entities/quota-company.entity';
import { QuotaCompanyQueryDto } from '@src/modules/manage/application/dto/query/quota-company.dto';
import { QuotaCompanyDataAccessMapper } from '../../mappers/quota-company.mapper';
import { QuotaCompanyId } from '@src/modules/manage/domain/value-objects/quota-company-id.vo';
import { EligiblePersons } from '@src/modules/manage/application/constants/status-key.const';

@Injectable()
export class ReadQuotaCompanyRepository implements IReadQuotaCompanyRepository {
  constructor(
    @InjectRepository(QuotaCompanyOrmEntity)
    private readonly _quotaOrm: Repository<QuotaCompanyOrmEntity>,
    private readonly _dataAccessMapper: QuotaCompanyDataAccessMapper,
    @Inject(PAGINATION_SERVICE)
    private readonly _paginationService: IPaginationService,
  ) {}
  async findAll(
    query: QuotaCompanyQueryDto,
    manager: EntityManager,
    company_id?: number,
    roles?: string[],
    department_id?: number,
  ): Promise<ResponseResult<QuotaCompanyEntity>> {
    const queryBuilder = await this.createBaseQuery(manager);
    query.sort_by = 'quota_companies.id';

    if (
      roles &&
      !roles.includes(EligiblePersons.SUPER_ADMIN) &&
      !roles.includes(EligiblePersons.ADMIN)
    ) {
      if (
        roles.includes(EligiblePersons.COMPANY_ADMIN) ||
        roles.includes(EligiblePersons.COMPANY_USER)
      ) {
        if (company_id) {
          queryBuilder.where('quota_companies.company_id = :company_id', {
            company_id,
          });
        }

        if (query.vendor_id) {
          queryBuilder.andWhere('vendor_product.vendor_id = :vendor_id', {
            vendor_id: query.vendor_id,
          });
        }

        if (query.product_id) {
          queryBuilder.andWhere('vendor_product.product_id = :product_id', {
            product_id: query.product_id,
          });
        }
      }
    }

    if (query.vendor_id) {
      queryBuilder.andWhere('vendor_product.vendor_id = :vendor_id', {
        vendor_id: query.vendor_id,
      });
    }

    if (query.product_id) {
      queryBuilder.andWhere('vendor_product.product_id = :product_id', {
        product_id: query.product_id,
      });
    }

    const data = await this._paginationService.paginate(
      queryBuilder,
      query,
      this._dataAccessMapper.toEntity.bind(this._dataAccessMapper),
      this.getFilterOptions(),
    );
    return data;
  }

  private createBaseQuery(manager: EntityManager) {
    // console.log('manager');
    return manager
      .createQueryBuilder(QuotaCompanyOrmEntity, 'quota_companies')
      .leftJoinAndSelect('quota_companies.company', 'company')
      .leftJoinAndSelect('quota_companies.vendor_product', 'vendor_product')
      .leftJoinAndSelect('vendor_product.products', 'products')
      .leftJoinAndSelect('products.product_type', 'product_type')
      .leftJoinAndSelect('products.unit', 'unit');
  }

  // vendor, product

  private getFilterOptions(): FilterOptions {
    return {
      searchColumns: ['quota_companies.year'],
      dateColumn: '',
      filterByColumns: [],
    };
  }

  async findOne(
    id: QuotaCompanyId,
    manager: EntityManager,
  ): Promise<ResponseResult<QuotaCompanyEntity>> {
    const item = await findOneOrFail(manager, QuotaCompanyOrmEntity, {
      id: id.value,
    });
    const itemWithRelation = await manager.findOne(QuotaCompanyOrmEntity, {
      where: { id: id.value },
      relations: ['company', 'vendor_product'],
    });

    return this._dataAccessMapper.toEntity(itemWithRelation || item);
  }
}
