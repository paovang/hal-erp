import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CreateReceiptDto } from '@src/modules/manage/application/dto/create/receipt/create.dto';
import { EntityManager } from 'typeorm';
import { ReceiptEntity } from '../../entities/receipt.entity';
import { ReceiptQueryDto } from '@src/modules/manage/application/dto/query/receipt.dto';
import { UpdateReceiptDto } from '@src/modules/manage/application/dto/create/receipt/update.dto';

export interface IReceiptServiceInterface {
  getAll(
    dto: ReceiptQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ReceiptEntity>>;

  getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<ReceiptEntity>>;

  create(
    dto: CreateReceiptDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ReceiptEntity>>;

  update(
    id: number,
    dto: UpdateReceiptDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ReceiptEntity>>;

  delete(id: number, manager?: EntityManager): Promise<void>;
}
