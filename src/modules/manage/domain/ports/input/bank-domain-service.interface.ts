import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { EntityManager } from 'typeorm';
import { BankQueryDto } from '@src/modules/manage/application/dto/query/bank-query.dto';
import { BankEntity } from '../../entities/bank.entity';
import { CreateBankDto } from '@src/modules/manage/application/dto/create/banks/create.dto';
import { UpdateBankDto } from '@src/modules/manage/application/dto/create/banks/update.dto';

export interface IBankServiceInterface {
  getAll(
    dto: BankQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<BankEntity>>;

  getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<BankEntity>>;

  create(
    dto: CreateBankDto,
    logo: any,
    manager?: EntityManager,
  ): Promise<ResponseResult<BankEntity>>;

  update(
    id: number,
    dto: UpdateBankDto,
    logo: any,
    manager?: EntityManager,
  ): Promise<ResponseResult<BankEntity>>;

  delete(id: number, manager?: EntityManager): Promise<void>;
}
