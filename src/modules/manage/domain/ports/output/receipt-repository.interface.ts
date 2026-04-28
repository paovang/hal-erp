import { EntityManager } from 'typeorm';
import { ReceiptEntity } from '../../entities/receipt.entity';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ReceiptQueryDto } from '@src/modules/manage/application/dto/query/receipt.dto';
import { ReceiptId } from '../../value-objects/receitp-id.vo';
import { PurchaseOrderEntity } from '../../entities/purchase-order.entity';
import { PurchaseRequestEntity } from '../../entities/purchase-request.entity';

export interface ReceiptPrintResult {
  receipt: ReceiptEntity;
  purchase_order: PurchaseOrderEntity | null;
  purchase_request: PurchaseRequestEntity | null;
}

export interface IWriteReceiptRepository {
  create(
    entity: ReceiptEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<ReceiptEntity>>;

  update(
    entity: ReceiptEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<ReceiptEntity>>;

  delete(id: ReceiptId, manager: EntityManager): Promise<void>;
}

export interface IReadReceiptRepository {
  findAll(
    query: ReceiptQueryDto,
    manager: EntityManager,
    user_id?: number,
    roles?: string[],
    company_id?: number,
  ): Promise<ResponseResult<ReceiptEntity>>;

  findOne(
    id: ReceiptId,
    manager: EntityManager,
  ): Promise<ResponseResult<ReceiptEntity>>;

  getPrint(
    id: ReceiptId,
    query: ReceiptQueryDto,
    manager: EntityManager,
  ): Promise<ReceiptPrintResult>;

  countItem(
    user_id: number,
    manager: EntityManager,
  ): Promise<ResponseResult<{ amount: number }>>;
}
