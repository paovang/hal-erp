import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CreatePurchaseRequestDto } from '@src/modules/manage/application/dto/create/purchaseRequest/create.dto';
import { EntityManager } from 'typeorm';
import { PurchaseRequestEntity } from '../../entities/purchase-request.entity';
import { PurchaseRequestQueryDto } from '@src/modules/manage/application/dto/query/purchase-request.dto';
import { PurchaseRequestExportQueryDto } from '@src/modules/manage/application/dto/query/purchase-request-export.dto';
import { UpdatePurchaseRequestDto } from '@src/modules/manage/application/dto/create/purchaseRequest/update.dto';
import { AddStepDto } from '@src/modules/manage/application/dto/create/purchaseRequest/add-step.dto';
import { PrListExportRow } from '@src/common/utils/excel-export.service';

export interface IPurchaseRequestServiceInterface {
  getAll(
    dto: PurchaseRequestQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<PurchaseRequestEntity>>;
  getAllForExport(
    dto: PurchaseRequestExportQueryDto,
    manager?: EntityManager,
  ): Promise<PrListExportRow[]>;
  getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<PurchaseRequestEntity>>;

  create(
    dto: CreatePurchaseRequestDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<PurchaseRequestEntity>>;

  update(
    id: number,
    dto: UpdatePurchaseRequestDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<PurchaseRequestEntity>>;

  delete(id: number, manager?: EntityManager): Promise<void>;

  addStep(
    id: number,
    dto: AddStepDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<PurchaseRequestEntity>>;
}
