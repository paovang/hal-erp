import { Injectable } from '@nestjs/common';
import { IWritePurchaseRequestRepository } from '@src/modules/manage/domain/ports/output/purchase-request-repository.interface';
import { PurchaseRequestDataAccessMapper } from '../../mappers/purchase-request.mapper';
import { PurchaseRequestEntity } from '@src/modules/manage/domain/entities/purchase-request.entity';
import { EntityManager } from 'typeorm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { PurchaseRequestOrmEntity } from '@src/common/infrastructure/database/typeorm/purchase-request.orm';
import { PurchaseRequestId } from '@src/modules/manage/domain/value-objects/purchase-request-id.vo';

@Injectable()
export class WritePurchaseRequestRepository
  implements IWritePurchaseRequestRepository
{
  constructor(
    private readonly _dataAccessMapper: PurchaseRequestDataAccessMapper,
  ) {}

  async create(
    entity: PurchaseRequestEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<PurchaseRequestEntity>> {
    return this._dataAccessMapper.toEntity(
      await manager.save(
        this._dataAccessMapper.toOrmEntity(entity, OrmEntityMethod.CREATE),
      ),
    );
  }

  async update(
    entity: PurchaseRequestEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<PurchaseRequestEntity>> {
    const OrmEntity = this._dataAccessMapper.toOrmEntity(
      entity,
      OrmEntityMethod.UPDATE,
    );

    try {
      await manager.update(
        PurchaseRequestOrmEntity,
        entity.getId().value,
        OrmEntity,
      );

      return this._dataAccessMapper.toEntity(OrmEntity);
    } catch (error) {
      throw error;
    }
  }

  async delete(id: PurchaseRequestId, manager: EntityManager): Promise<void> {
    try {
      await manager.softDelete(PurchaseRequestOrmEntity, id.value);
    } catch (error) {
      throw error;
    }
  }
}
