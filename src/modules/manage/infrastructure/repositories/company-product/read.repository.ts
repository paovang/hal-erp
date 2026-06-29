import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PAGINATION_SERVICE } from '@src/common/constants/inject-key.const';
import { CompanyProductOrmEntity } from '@src/common/infrastructure/database/typeorm/company-product.orm';
import {
  FilterOptions,
  IPaginationService,
  ResponseResult,
} from '@src/common/infrastructure/pagination/pagination.interface';
import { CompanyProductQueryDto } from '@src/modules/manage/application/dto/query/company-product-query.dto';
import { CompanyProductEntity } from '@src/modules/manage/domain/entities/company-product.entity';
import { IReadCompanyProductRepository } from '@src/modules/manage/domain/ports/output/company-product-repository.interface';
import { EntityManager, Repository } from 'typeorm';
import { CompanyProductDataAccessMapper } from '../../mappers/company-product.mapper';
import { CompanyProductId } from '@src/modules/manage/domain/value-objects/company-product-id.vo';
import { EligiblePersons } from '@src/modules/manage/application/constants/status-key.const';

@Injectable()
export class ReadCompanyProductRepository
  implements IReadCompanyProductRepository
{
  constructor(
    @InjectRepository(CompanyProductOrmEntity)
    private readonly _companyProductOrm: Repository<CompanyProductOrmEntity>,
    private readonly _dataAccessMapper: CompanyProductDataAccessMapper,
    @Inject(PAGINATION_SERVICE)
    private readonly _paginationService: IPaginationService,
  ) {}

  async findAll(
    query: CompanyProductQueryDto,
    manager: EntityManager,
    roles?: string[],
    company_id?: number,
  ): Promise<ResponseResult<CompanyProductEntity>> {
    const queryBuilder = this.createBaseQuery(manager);

    // Company isolation: admins/super-admins are unrestricted, everyone else is
    // scoped to their own company; a caller with no resolvable company sees nothing.
    const isAdmin =
      roles?.includes(EligiblePersons.SUPER_ADMIN) ||
      roles?.includes(EligiblePersons.ADMIN);

    if (!isAdmin) {
      if (company_id) {
        queryBuilder.andWhere('company_products.company_id = :scopeCompanyId', {
          scopeCompanyId: company_id,
        });
      } else {
        // fail-safe: no resolvable company → return nothing
        queryBuilder.andWhere('1 = 0');
      }
    }

    // Apply company_id filter if provided
    if (query.company_id) {
      queryBuilder.andWhere('company_products.company_id = :companyId', {
        companyId: query.company_id,
      });
    }

    // Apply product_id filter if provided
    if (query.product_id) {
      queryBuilder.andWhere('company_products.product_id = :productId', {
        productId: query.product_id,
      });
    }

    // Apply status filter if provided
    if (query.status) {
      queryBuilder.andWhere('company_products.status = :status', {
        status: query.status,
      });
    }

    query.sort_by = 'company_products.id';

    const data = await this._paginationService.paginate(
      queryBuilder,
      query,
      this._dataAccessMapper.toEntity.bind(this._dataAccessMapper),
      this.getFilterOptions(),
    );
    return data;
  }

  private createBaseQuery(manager: EntityManager) {
    return manager
      .createQueryBuilder(CompanyProductOrmEntity, 'company_products')
      .leftJoinAndSelect('company_products.company', 'company')
      .leftJoinAndSelect('company_products.product', 'product');
  }

  private getFilterOptions(): FilterOptions {
    return {
      searchColumns: ['product.name', 'company.name'],
      dateColumn: '',
      filterByColumns: [
        'company_products.company_id',
        'company_products.product_id',
        'company_products.status',
      ],
    };
  }

  async findOne(
    id: CompanyProductId,
    manager: EntityManager,
  ): Promise<ResponseResult<CompanyProductEntity>> {
    const item = await manager.findOne(CompanyProductOrmEntity, {
      where: { id: id.value },
      relations: ['company', 'product'],
    });

    if (!item) {
      throw new Error('Company product not found');
    }

    return this._dataAccessMapper.toEntity(item);
  }
}
