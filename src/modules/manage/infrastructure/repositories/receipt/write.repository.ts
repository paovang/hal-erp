import { Injectable } from '@nestjs/common';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { ReceiptEntity } from '@src/modules/manage/domain/entities/receipt.entity';
import { IWriteReceiptRepository } from '@src/modules/manage/domain/ports/output/receipt-repository.interface';
import { EntityManager } from 'typeorm';
import { ReceiptDataAccessMapper } from '../../mappers/receipt.mapper';
import { ReceiptId } from '@src/modules/manage/domain/value-objects/receitp-id.vo';
import { ReceiptOrmEntity } from '@src/common/infrastructure/database/typeorm/receipt.orm';

@Injectable()
export class WriteReceiptRepository implements IWriteReceiptRepository {
  constructor(private readonly _dataAccessMapper: ReceiptDataAccessMapper) {}

  async create(
    entity: ReceiptEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<ReceiptEntity>> {
    return this._dataAccessMapper.toEntity(
      await manager.save(
        this._dataAccessMapper.toOrmEntity(entity, OrmEntityMethod.CREATE),
      ),
    );
  }

  async delete(id: ReceiptId, manager: EntityManager): Promise<void> {
    try {
      await manager.softDelete(ReceiptOrmEntity, id.value);
    } catch (error) {
      throw error;
    }
  }
}
