import { Injectable } from '@nestjs/common';
import { IWritePurchaseRequestItemRepository } from '@src/modules/manage/domain/ports/output/purchase-request-item-repository.interface';
import { PurchaseRequestItemDataAccessMapper } from '../../mappers/purchase-request-item.mapper';
import { PurchaseRequestItemEntity } from '@src/modules/manage/domain/entities/purchase-request-item.entity';
import { EntityManager } from 'typeorm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { PurchaseRequestItemOrmEntity } from '@src/common/infrastructure/database/typeorm/purchase-request-item.orm';
import { PurchaseRequestItemId } from '@src/modules/manage/domain/value-objects/purchase-request-item-id.vo';

@Injectable()
export class WritePurchaseRequestItemRepository
  implements IWritePurchaseRequestItemRepository
{
  constructor(
    private readonly _dataAccessMapper: PurchaseRequestItemDataAccessMapper,
  ) {}

  async create(
    entity: PurchaseRequestItemEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<PurchaseRequestItemEntity>> {
    return this._dataAccessMapper.toEntity(
      await manager.save(
        this._dataAccessMapper.toOrmEntity(entity, OrmEntityMethod.CREATE),
      ),
    );
  }

  async update(
    entity: PurchaseRequestItemEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<PurchaseRequestItemEntity>> {
    const OrmEntity = this._dataAccessMapper.toOrmEntity(
      entity,
      OrmEntityMethod.UPDATE,
    );

    try {
      await manager.update(
        PurchaseRequestItemOrmEntity,
        entity.getId().value,
        OrmEntity,
      );

      return this._dataAccessMapper.toEntity(OrmEntity);
    } catch (error) {
      throw error;
    }
  }

  async delete(
    id: PurchaseRequestItemId,
    manager: EntityManager,
  ): Promise<void> {
    try {
      await manager.softDelete(PurchaseRequestItemOrmEntity, id.value);
    } catch (error) {
      throw error;
    }
  }
}
