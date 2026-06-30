import { Injectable } from '@nestjs/common';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CompanyVendorEntity } from '@src/modules/manage/domain/entities/company-vendor.entity';
import { IWriteCompanyVendorRepository } from '@src/modules/manage/domain/ports/output/company-vendor-repository.interface';
import { EntityManager } from 'typeorm';
import { CompanyVendorDataAccessMapper } from '../../mappers/company-vendor.mapper';
import { CompanyVendorOrmEntity } from '@src/common/infrastructure/database/typeorm/company-vendor.orm';
import { CompanyVendorId } from '@src/modules/manage/domain/value-objects/company-vendor-id.vo';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';

@Injectable()
export class WriteCompanyVendorRepository
  implements IWriteCompanyVendorRepository
{
  constructor(
    private readonly _dataAccessMapper: CompanyVendorDataAccessMapper,
  ) {}

  async create(
    entity: CompanyVendorEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<CompanyVendorEntity>> {
    return this._dataAccessMapper.toEntity(
      await manager.save(
        this._dataAccessMapper.toOrmEntity(entity, OrmEntityMethod.CREATE),
      ),
    );
  }

  async update(
    entity: CompanyVendorEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<CompanyVendorEntity>> {
    const ormEntity = this._dataAccessMapper.toOrmEntity(
      entity,
      OrmEntityMethod.UPDATE,
    );

    await manager.update(
      CompanyVendorOrmEntity,
      entity.getId().value,
      ormEntity,
    );

    return this._dataAccessMapper.toEntity(ormEntity);
  }

  async delete(id: CompanyVendorId, manager: EntityManager): Promise<void> {
    await manager.softDelete(CompanyVendorOrmEntity, id.value);
  }
}
