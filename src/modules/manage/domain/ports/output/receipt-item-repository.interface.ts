import { EntityManager } from 'typeorm';
import { ReceiptItemEntity } from '../../entities/receipt-item.entity';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ReceiptItemId } from '../../value-objects/receipt-item-id.vo';

export interface IWriteReceiptItemRepository {
  create(
    entity: ReceiptItemEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<ReceiptItemEntity>>;

  update(
    entity: ReceiptItemEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<ReceiptItemEntity>>;

  delete(id: ReceiptItemId, manager: EntityManager): Promise<void>;
}
