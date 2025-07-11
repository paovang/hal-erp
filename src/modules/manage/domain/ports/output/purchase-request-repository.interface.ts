import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { PurchaseRequestQueryDto } from '@src/modules/manage/application/dto/query/purchase-request.dto';
import { EntityManager } from 'typeorm';
import { PurchaseRequestEntity } from '../../entities/purchase-request.entity';
import { PurchaseRequestId } from '../../value-objects/purchase-request-id.vo';

export interface IWritePurchaseRequestRepository {
  create(
    entity: PurchaseRequestEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<PurchaseRequestEntity>>;
  update(
    entity: PurchaseRequestEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<PurchaseRequestEntity>>;

  delete(id: PurchaseRequestId, manager: EntityManager): Promise<void>;
}

export interface IReadPurchaseRequestRepository {
  findAll(
    query: PurchaseRequestQueryDto,
    manager: EntityManager,
    departmentId?: number,
    user_id?: number,
    min?: number,
    max?: number,
  ): Promise<ResponseResult<PurchaseRequestEntity>>;
  findOne(
    id: PurchaseRequestId,
    manager: EntityManager,
  ): Promise<ResponseResult<PurchaseRequestEntity>>;
}
