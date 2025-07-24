import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PAGINATION_SERVICE } from '@src/common/constants/inject-key.const';
import { VendorBankAccountOrmEntity } from '@src/common/infrastructure/database/typeorm/vendor_bank_account.orm';
import {
  FilterOptions,
  IPaginationService,
  ResponseResult,
} from '@src/common/infrastructure/pagination/pagination.interface';
import { IReadVendorBankAccountRepository } from '@src/modules/manage/domain/ports/output/vendor-bank-account-repository.interface';
import { EntityManager, Repository } from 'typeorm';
import { VendorBankAccountDataAccessMapper } from '../../mappers/vendor-bank-account.mapper';
import { VendorBankAccountQueryDto } from '@src/modules/manage/application/dto/query/vendor-bank-account-query.dto';
import { VendorBankAccountEntity } from '@src/modules/manage/domain/entities/vendor-bank-account.entity';
import { VendorBankAccountId } from '@src/modules/manage/domain/value-objects/vendor-bank-account-id.vo';

@Injectable()
export class ReadVendorBankAccountRepository
  implements IReadVendorBankAccountRepository
{
  constructor(
    @InjectRepository(VendorBankAccountOrmEntity)
    private readonly _vendorBankAccountOrm: Repository<VendorBankAccountOrmEntity>,
    private readonly _dataAccessMapper: VendorBankAccountDataAccessMapper,
    @Inject(PAGINATION_SERVICE)
    private readonly _paginationService: IPaginationService,
  ) {}

  async findAll(
    id: number,
    query: VendorBankAccountQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<VendorBankAccountEntity>> {
    const queryBuilder = await this.createBaseQuery(manager, id);
    query.sort_by = 'vendor_bank_accounts.id';

    const data = await this._paginationService.paginate(
      queryBuilder,
      query,
      this._dataAccessMapper.toEntity.bind(this._dataAccessMapper),
      this.getFilterOptions(),
    );
    return data;
  }

  private createBaseQuery(manager: EntityManager, id?: number) {
    return manager
      .createQueryBuilder(VendorBankAccountOrmEntity, 'vendor_bank_accounts')
      .leftJoinAndSelect('vendor_bank_accounts.vendors', 'vendors')
      .leftJoinAndSelect('vendor_bank_accounts.currencies', 'currencies')
      .where('vendors.id = :id', { id });
  }

  private getFilterOptions(): FilterOptions {
    return {
      searchColumns: [
        'vendor_bank_accounts.bank_name',
        'vendor_bank_accounts.account_name',
        'vendor_bank_accounts.account_number',
        'vendors.name',
        'vendors.contact_info',
        'currencies.name',
        'currencies.code',
      ],
      dateColumn: '',
      filterByColumns: [],
    };
  }

  async findOne(
    id: VendorBankAccountId,
    manager: EntityManager,
  ): Promise<ResponseResult<VendorBankAccountEntity>> {
    const item = await this.createBaseQuery(manager)
      .where('vendor_bank_accounts.id = :id', { id: id.value })
      .getOneOrFail();

    return this._dataAccessMapper.toEntity(item);
  }
}
