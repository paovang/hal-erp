import { Injectable } from '@nestjs/common';
import { IWritePurchaseOrderSelectedVendorRepository } from '@src/modules/manage/domain/ports/output/Purchase-order-selected-vendor-repository.interface';
import { PurchaseOrderSelectedVendorDataAccessMapper } from '../../mappers/purchase-order-selected-vendor.mapper';
import { PurchaseOrderSelectedVendorEntity } from '@src/modules/manage/domain/entities/purchase-order-selected-vendor.entity';
import { EntityManager } from 'typeorm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { PurchaseOrderSelectedVendorOrmEntity } from '@src/common/infrastructure/database/typeorm/purchase-order-selected-vendor.orm';
import { PurchaseOrderSelectedVendorId } from '@src/modules/manage/domain/value-objects/purchase-order-selected-vendor-id.vo';

@Injectable()
export class WritePurchaseOrderSelectedVendorRepository
  implements IWritePurchaseOrderSelectedVendorRepository
{
  constructor(
    private readonly _dataAccessMapper: PurchaseOrderSelectedVendorDataAccessMapper,
  ) {}

  async create(
    entity: PurchaseOrderSelectedVendorEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<PurchaseOrderSelectedVendorEntity>> {
    return this._dataAccessMapper.toEntity(
      await manager.save(
        this._dataAccessMapper.toOrmEntity(entity, OrmEntityMethod.CREATE),
      ),
    );
  }

  async update(
    entity: PurchaseOrderSelectedVendorEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<PurchaseOrderSelectedVendorEntity>> {
    const OrmEntity = this._dataAccessMapper.toOrmEntity(
      entity,
      OrmEntityMethod.UPDATE,
    );

    try {
      await manager.update(
        PurchaseOrderSelectedVendorOrmEntity,
        entity.getId().value,
        OrmEntity,
      );

      return this._dataAccessMapper.toEntity(OrmEntity);
    } catch (error) {
      throw error;
    }
  }

  async delete(
    id: PurchaseOrderSelectedVendorId,
    manager: EntityManager,
  ): Promise<void> {
    try {
      await manager.softDelete(PurchaseOrderSelectedVendorOrmEntity, id.value);
    } catch (error) {
      throw error;
    }
  }
}
