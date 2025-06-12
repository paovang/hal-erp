import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CreatePurchaseRequestDto } from '@src/modules/manage/application/dto/create/purchaseRequest/create.dto';
import { EntityManager } from 'typeorm';
import { PurchaseRequestEntity } from '../../entities/purchase-request.entity';

export interface IPurchaseRequestServiceInterface {
  //   getAll(
  //     dto: PositionQueryDto,
  //     manager?: EntityManager,
  //   ): Promise<ResponseResult<PositionEntity>>;
  //   getOne(
  //     id: number,
  //     manager?: EntityManager,
  //   ): Promise<ResponseResult<PositionEntity>>;
  create(
    dto: CreatePurchaseRequestDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<PurchaseRequestEntity>>;
  //   update(
  //     id: number,
  //     dto: UpdatePositionDto,
  //     manager?: EntityManager,
  //   ): Promise<ResponseResult<PositionEntity>>;
  //   delete(id: number, manager?: EntityManager): Promise<void>;
}
