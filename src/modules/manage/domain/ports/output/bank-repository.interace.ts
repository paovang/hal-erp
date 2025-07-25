import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { BankQueryDto } from '@src/modules/manage/application/dto/query/bank-query.dto';
import { EntityManager } from 'typeorm';
import { BankId } from '../../value-objects/bank-id.vo';
import { BankEntity } from '../../entities/bank.entity';
export interface IReadBankRepository {
  findAll(
    query: BankQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<BankEntity>>;

  findOne(
    id: BankId,
    manager: EntityManager,
  ): Promise<ResponseResult<BankEntity>>;
}

export interface IWriteBankRepository {
  create(
    entity: BankEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<BankEntity>>;

  update(
    entity: BankEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<BankEntity>>;

  // updateColumns(
  //   entity: BankEntity,
  //   manager: EntityManager,
  // ): Promise<ResponseResult<BankEntity>>;

  delete(id: BankId, manager: EntityManager): Promise<void>;
}
