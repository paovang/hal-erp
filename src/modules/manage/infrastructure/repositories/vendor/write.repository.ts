import { Injectable } from '@nestjs/common';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { VendorEntity } from '@src/modules/manage/domain/entities/vendor.entity';
import { IWriteVendorRepository } from '@src/modules/manage/domain/ports/output/vendor-repository.interface';
import { EntityManager } from 'typeorm';
import { VendorDataAccessMapper } from '../../mappers/vendor.mapper';
import { VendorOrmEntity } from '@src/common/infrastructure/database/typeorm/vendor.orm';
import { VendorId } from '@src/modules/manage/domain/value-objects/vendor-id.vo';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';

@Injectable()
export class WriteVendorRepository implements IWriteVendorRepository {
  constructor(private readonly _dataAccessMapper: VendorDataAccessMapper) {}

  async create(
    entity: VendorEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<VendorEntity>> {
    return this._dataAccessMapper.toEntity(
      await manager.save(
        this._dataAccessMapper.toOrmEntity(entity, OrmEntityMethod.CREATE),
      ),
    );
  }

  async update(
    entity: VendorEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<VendorEntity>> {
    const OrmEntity = this._dataAccessMapper.toOrmEntity(
      entity,
      OrmEntityMethod.UPDATE,
    );

    try {
      await manager.update(VendorOrmEntity, entity.getId().value, OrmEntity);

      return this._dataAccessMapper.toEntity(OrmEntity);
    } catch (error) {
      throw error;
    }
  }

  async delete(id: VendorId, manager: EntityManager): Promise<void> {
    try {
      await manager.softDelete(VendorOrmEntity, id.value);
    } catch (error) {
      throw error;
    }
  }
}
