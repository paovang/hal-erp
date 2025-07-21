import { Injectable } from '@nestjs/common';
import { IWriteReceiptItemRepository } from '@src/modules/manage/domain/ports/output/receipt-item-repository.interface';
import { ReceiptItemDataAccessMapper } from '../../mappers/receipt-item.mapper';
import { ReceiptItemEntity } from '@src/modules/manage/domain/entities/receipt-item.entity';
import { EntityManager } from 'typeorm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { ReceiptItemOrmEntity } from '@src/common/infrastructure/database/typeorm/receipt.item.orm';
import { ReceiptItemId } from '@src/modules/manage/domain/value-objects/receipt-item-id.vo';

@Injectable()
export class WriteReceiptItemRepository implements IWriteReceiptItemRepository {
  constructor(
    private readonly _dataAccessMapper: ReceiptItemDataAccessMapper,
  ) {}

  async create(
    entity: ReceiptItemEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<ReceiptItemEntity>> {
    return this._dataAccessMapper.toEntity(
      await manager.save(
        this._dataAccessMapper.toOrmEntity(entity, OrmEntityMethod.CREATE),
      ),
    );
  }

  async update(
    entity: ReceiptItemEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<ReceiptItemEntity>> {
    const OrmEntity = this._dataAccessMapper.toOrmEntity(
      entity,
      OrmEntityMethod.UPDATE,
    );

    try {
      await manager.update(
        ReceiptItemOrmEntity,
        entity.getId().value,
        OrmEntity,
      );

      return this._dataAccessMapper.toEntity(OrmEntity);
    } catch (error) {
      throw error;
    }
  }

  async delete(id: ReceiptItemId, manager: EntityManager): Promise<void> {
    try {
      await manager.softDelete(ReceiptItemOrmEntity, id.value);
    } catch (error) {
      throw error;
    }
  }
}
