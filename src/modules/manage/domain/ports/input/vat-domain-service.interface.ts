import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { EntityManager } from 'typeorm';
import { VatEntity } from '../../entities/vat.entity';
import { CreateVatDto } from '@src/modules/manage/application/dto/create/vat/create.dto';
import { UpdateVatDto } from '@src/modules/manage/application/dto/create/vat/update.dto';
import { VatQueryDto } from '@src/modules/manage/application/dto/query/vat-query.dto';

export interface IVatServiceInterface {
  getAll(
    dto: VatQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<VatEntity>>;

  getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<VatEntity>>;

  create(
    dto: CreateVatDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<VatEntity>>;

  update(
    id: number,
    dto: UpdateVatDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<VatEntity>>;

  delete(id: number, manager?: EntityManager): Promise<void>;
}
