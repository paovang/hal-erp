import { Injectable } from '@nestjs/common';
import { IWritePurchaseOrderItemRepository } from '@src/modules/manage/domain/ports/output/purchase-order-item-repository.interface';
import { PurchaseOrderItemDataAccessMapper } from '../../mappers/purchase-order-item.mapper';
import { PurchaseOrderItemEntity } from '@src/modules/manage/domain/entities/purchase-order-item.entity';
import { EntityManager } from 'typeorm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { PurchaseOrderItemOrmEntity } from '@src/common/infrastructure/database/typeorm/purchase-order-item.orm';
import { PurchaseOrderItemId } from '@src/modules/manage/domain/value-objects/purchase-order-item-id.vo';

@Injectable()
export class WritePurchaseOrderItemRepository
  implements IWritePurchaseOrderItemRepository
{
  constructor(
    private readonly _dataAccessMapper: PurchaseOrderItemDataAccessMapper,
  ) {}

  async create(
    entity: PurchaseOrderItemEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<PurchaseOrderItemEntity>> {
    return this._dataAccessMapper.toEntity(
      await manager.save(
        this._dataAccessMapper.toOrmEntity(entity, OrmEntityMethod.CREATE),
      ),
    );
  }

  async update(
    entity: PurchaseOrderItemEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<PurchaseOrderItemEntity>> {
    const OrmEntity = this._dataAccessMapper.toOrmEntity(
      entity,
      OrmEntityMethod.UPDATE,
    );

    try {
      await manager.update(
        PurchaseOrderItemOrmEntity,
        entity.getId().value,
        OrmEntity,
      );

      return this._dataAccessMapper.toEntity(OrmEntity);
    } catch (error) {
      throw error;
    }
  }

  async delete(id: PurchaseOrderItemId, manager: EntityManager): Promise<void> {
    try {
      await manager.softDelete(PurchaseOrderItemOrmEntity, id.value);
    } catch (error) {
      throw error;
    }
  }
}
