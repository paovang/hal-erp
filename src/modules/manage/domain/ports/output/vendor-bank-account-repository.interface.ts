import { EntityManager } from 'typeorm';
import { VendorBankAccountEntity } from '../../entities/vendor-bank-account.entity';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { VendorBankAccountQueryDto } from '@src/modules/manage/application/dto/query/vendor-bank-account-query.dto';
import { VendorBankAccountId } from '../../value-objects/vendor-bank-account-id.vo';

export interface IWriteVendorBankAccountRepository {
  create(
    entity: VendorBankAccountEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<VendorBankAccountEntity>>;

  update(
    entity: VendorBankAccountEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<VendorBankAccountEntity>>;

  useBankAccount(
    entity: VendorBankAccountEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<VendorBankAccountEntity>>;

  delete(id: VendorBankAccountId, manager: EntityManager): Promise<void>;
}

export interface IReadVendorBankAccountRepository {
  findAll(
    id: number,
    query: VendorBankAccountQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<VendorBankAccountEntity>>;

  findOne(
    id: VendorBankAccountId,
    manager: EntityManager,
  ): Promise<ResponseResult<VendorBankAccountEntity>>;
}
