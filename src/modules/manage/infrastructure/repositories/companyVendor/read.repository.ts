import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PAGINATION_SERVICE } from '@src/common/constants/inject-key.const';
import { CompanyVendorOrmEntity } from '@src/common/infrastructure/database/typeorm/company-vendor.orm';
import {
  FilterOptions,
  IPaginationService,
  ResponseResult,
} from '@src/common/infrastructure/pagination/pagination.interface';
import { CompanyVendorQueryDto } from '@src/modules/manage/application/dto/query/company-vendor-query.dto';
import { CompanyVendorEntity } from '@src/modules/manage/domain/entities/company-vendor.entity';
import { IReadCompanyVendorRepository } from '@src/modules/manage/domain/ports/output/company-vendor-repository.interface';
import { EntityManager, IsNull, Repository } from 'typeorm';
import { CompanyVendorDataAccessMapper } from '../../mappers/company-vendor.mapper';
import { CompanyVendorId } from '@src/modules/manage/domain/value-objects/company-vendor-id.vo';

@Injectable()
export class ReadCompanyVendorRepository
  implements IReadCompanyVendorRepository
{
  constructor(
    @InjectRepository(CompanyVendorOrmEntity)
    private readonly _companyVendorOrm: Repository<CompanyVendorOrmEntity>,
    private readonly _dataAccessMapper: CompanyVendorDataAccessMapper,
    @Inject(PAGINATION_SERVICE)
    private readonly _paginationService: IPaginationService,
  ) {}

  async findAll(
    query: CompanyVendorQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<CompanyVendorEntity>> {
    const queryBuilder = this.createBaseQuery(manager);

    if (query.company_id) {
      queryBuilder.andWhere('company_vendors.company_id = :companyId', {
        companyId: query.company_id,
      });
    }

    if (query.vendor_id) {
      queryBuilder.andWhere('company_vendors.vendor_id = :vendorId', {
        vendorId: query.vendor_id,
      });
    }

    if (query.status) {
      queryBuilder.andWhere('company_vendors.status = :status', {
        status: query.status,
      });
    }

    query.sort_by = 'company_vendors.id';

    return this._paginationService.paginate(
      queryBuilder,
      query,
      this._dataAccessMapper.toEntity.bind(this._dataAccessMapper),
      this.getFilterOptions(),
    );
  }

  private createBaseQuery(manager: EntityManager) {
    return manager
      .createQueryBuilder(CompanyVendorOrmEntity, 'company_vendors')
      .leftJoinAndSelect('company_vendors.company', 'company')
      .leftJoinAndSelect('company_vendors.vendors', 'vendor');
  }

  private getFilterOptions(): FilterOptions {
    return {
      searchColumns: ['vendor.name', 'company.name'],
      dateColumn: '',
      filterByColumns: [
        'company_vendors.company_id',
        'company_vendors.vendor_id',
        'company_vendors.status',
      ],
    };
  }

  async findOne(
    id: CompanyVendorId,
    manager: EntityManager,
  ): Promise<ResponseResult<CompanyVendorEntity>> {
    const item = await manager.findOne(CompanyVendorOrmEntity, {
      where: { id: id.value },
      relations: ['company', 'vendors'],
    });

    if (!item) {
      throw new Error('Company vendor not found');
    }

    return this._dataAccessMapper.toEntity(item);
  }

  async findActiveByCompanyAndVendor(
    companyId: number,
    vendorId: number,
    manager: EntityManager,
  ): Promise<CompanyVendorEntity | null> {
    const item = await manager.findOne(CompanyVendorOrmEntity, {
      where: {
        company_id: companyId,
        vendor_id: vendorId,
        status: 'active',
        deleted_at: IsNull(),
      },
      relations: ['company', 'vendors'],
    });

    return item ? this._dataAccessMapper.toEntity(item) : null;
  }
}
