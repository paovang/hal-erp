import { Injectable } from '@nestjs/common';
import { IWritePurchaseOrderRepository } from '@src/modules/manage/domain/ports/output/purchase-order-repository.interface';
import { PurchaseOrderDataAccessMapper } from '../../mappers/purchase-order.mapper';
import { PurchaseOrderEntity } from '@src/modules/manage/domain/entities/purchase-order.entity';
import { EntityManager } from 'typeorm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { PurchaseOrderId } from '@src/modules/manage/domain/value-objects/purchase-order-id.vo';
import { PurchaseOrderOrmEntity } from '@src/common/infrastructure/database/typeorm/purchase-order.orm';

@Injectable()
export class WritePurchaseOrderRepository
  implements IWritePurchaseOrderRepository
{
  constructor(
    private readonly _dataAccessMapper: PurchaseOrderDataAccessMapper,
  ) {}

  async create(
    entity: PurchaseOrderEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<PurchaseOrderEntity>> {
    return this._dataAccessMapper.toEntity(
      await manager.save(
        this._dataAccessMapper.toOrmEntity(entity, OrmEntityMethod.CREATE),
      ),
    );
  }

  async delete(id: PurchaseOrderId, manager: EntityManager): Promise<void> {
    try {
      await manager.softDelete(PurchaseOrderOrmEntity, id.value);
    } catch (error) {
      throw error;
    }
  }
}
