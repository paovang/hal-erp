import { Injectable } from '@nestjs/common';
import { IWritePurchaseOrderSelectedVendorRepository } from '@src/modules/manage/domain/ports/output/Purchase-order-selected-vendor-repository.interface';
import { PurchaseOrderSelectedVendorDataAccessMapper } from '../../mappers/purchase-order-selected-vendor.mapper';
import { PurchaseOrderSelectedVendorEntity } from '@src/modules/manage/domain/entities/purchase-order-selected-vendor.entity';
import { EntityManager } from 'typeorm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';

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
    console.log('object', entity);
    return this._dataAccessMapper.toEntity(
      await manager.save(
        this._dataAccessMapper.toOrmEntity(entity, OrmEntityMethod.CREATE),
      ),
    );
  }
}
