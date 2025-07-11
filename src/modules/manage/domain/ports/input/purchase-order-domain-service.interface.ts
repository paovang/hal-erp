import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { PurchaseOrderQueryDto } from '@src/modules/manage/application/dto/query/purchase-order.dto';
import { EntityManager } from 'typeorm';
import { PurchaseOrderEntity } from '../../entities/purchase-order.entity';
import { CreatePurchaseOrderDto } from '@src/modules/manage/application/dto/create/purchaseOrder/create.dto';
import { UpdatePurchaseOrderDto } from '@src/modules/manage/application/dto/create/purchaseOrder/update.dto';

export interface IPurchaseOrderServiceInterface {
  getAll(
    dto: PurchaseOrderQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<PurchaseOrderEntity>>;

  getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<PurchaseOrderEntity>>;

  create(
    dto: CreatePurchaseOrderDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<PurchaseOrderEntity>>;

  update(
    id: number,
    dto: UpdatePurchaseOrderDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<PurchaseOrderEntity>>;

  updateBudgetItem(
    id: number,
    dto: UpdatePurchaseOrderDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<PurchaseOrderEntity>>;

  delete(id: number, manager?: EntityManager): Promise<void>;
}
