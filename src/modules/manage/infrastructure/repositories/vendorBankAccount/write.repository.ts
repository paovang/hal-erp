import { Injectable } from '@nestjs/common';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { VendorBankAccountEntity } from '@src/modules/manage/domain/entities/vendor-bank-account.entity';
import { IWriteVendorBankAccountRepository } from '@src/modules/manage/domain/ports/output/vendor-bank-account-repository.interface';
import { EntityManager } from 'typeorm';
import { VendorBankAccountDataAccessMapper } from '../../mappers/vendor-bank-account.mapper';
import { VendorBankAccountOrmEntity } from '@src/common/infrastructure/database/typeorm/vendor_bank_account.orm';
import { VendorBankAccountId } from '@src/modules/manage/domain/value-objects/vendor-bank-account-id.vo';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';

@Injectable()
export class WriteVendorBankAccountRepository
  implements IWriteVendorBankAccountRepository
{
  constructor(
    private readonly _dataAccessMapper: VendorBankAccountDataAccessMapper,
  ) {}

  async create(
    entity: VendorBankAccountEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<VendorBankAccountEntity>> {
    return this._dataAccessMapper.toEntity(
      await manager.save(
        this._dataAccessMapper.toOrmEntity(entity, OrmEntityMethod.CREATE),
      ),
    );
  }

  async update(
    entity: VendorBankAccountEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<VendorBankAccountEntity>> {
    const OrmEntity = this._dataAccessMapper.toOrmEntity(
      entity,
      OrmEntityMethod.UPDATE,
    );

    try {
      await manager.update(
        VendorBankAccountOrmEntity,
        entity.getId().value,
        OrmEntity,
      );

      return this._dataAccessMapper.toEntity(OrmEntity);
    } catch (error) {
      throw error;
    }
  }

  async useBankAccount(
    entity: VendorBankAccountEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<VendorBankAccountEntity>> {
    const OrmEntity = this._dataAccessMapper.toOrmEntity(
      entity,
      OrmEntityMethod.UPDATE,
    );

    try {
      await manager.update(
        VendorBankAccountOrmEntity,
        entity.getId().value,
        OrmEntity,
      );

      return this._dataAccessMapper.toEntity(OrmEntity);
    } catch (error) {
      throw error;
    }
  }

  async delete(id: VendorBankAccountId, manager: EntityManager): Promise<void> {
    try {
      await manager.softDelete(VendorBankAccountOrmEntity, id.value);
    } catch (error) {
      throw error;
    }
  }
}
