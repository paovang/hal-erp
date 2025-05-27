import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CreateVendorBankAccountDto } from '@src/modules/manage/application/dto/create/vendorBankAccount/create.dto';
import { EntityManager } from 'typeorm';
import { VendorBankAccountEntity } from '../../entities/vendor-bank-account.entity';
import { VendorBankAccountQueryDto } from '@src/modules/manage/application/dto/query/vendor-bank-account-query.dto';
import { UpdateVendorBankAccountDto } from '@src/modules/manage/application/dto/create/vendorBankAccount/update.dto';

export interface IVendorBankAccountServiceInterface {
  create(
    dto: CreateVendorBankAccountDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<VendorBankAccountEntity>>;

  getAll(
    dto: VendorBankAccountQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<VendorBankAccountEntity>>;

  getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<VendorBankAccountEntity>>;

  update(
    id: number,
    dto: UpdateVendorBankAccountDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<VendorBankAccountEntity>>;

  delete(id: number, manager?: EntityManager): Promise<void>;
}
