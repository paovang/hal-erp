import { EntityManager } from 'typeorm';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { VatEntity } from '../../entities/vat.entity';
import { VatId } from '../../value-objects/vat-id.vo';
import { VatQueryDto } from '@src/modules/manage/application/dto/query/vat-query.dto';

export interface IWriteVatRepository {
  create(
    entity: VatEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<VatEntity>>;

  update(
    entity: VatEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<VatEntity>>;

  delete(id: VatId, manager: EntityManager): Promise<void>;
}

export interface IReadVatRepository {
  findAll(
    query: VatQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<VatEntity>>;

  findOne(
    id: VatId,
    manager: EntityManager,
  ): Promise<ResponseResult<VatEntity>>;
}
