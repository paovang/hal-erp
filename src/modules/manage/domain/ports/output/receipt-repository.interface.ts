import { EntityManager } from 'typeorm';
import { ReceiptEntity } from '../../entities/receipt.entity';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ReceiptQueryDto } from '@src/modules/manage/application/dto/query/receipt.dto';
import { ReceiptId } from '../../value-objects/receitp-id.vo';

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
  ): Promise<ResponseResult<ReceiptEntity>>;

  findOne(
    id: ReceiptId,
    manager: EntityManager,
  ): Promise<ResponseResult<ReceiptEntity>>;
}
