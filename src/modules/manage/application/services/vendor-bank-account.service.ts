import { Injectable } from '@nestjs/common';
import { IVendorBankAccountServiceInterface } from '../../domain/ports/input/vendor-bank-account-domain-service.interface';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { CreateVendorBankAccountDto } from '../dto/create/vendorBankAccount/create.dto';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { VendorBankAccountEntity } from '../../domain/entities/vendor-bank-account.entity';
import { CreateCommand } from '../commands/vendorBankAccount/create.command';
import { GetAllQuery } from '../queries/vendorBankAccount/get-all.query';
import { VendorBankAccountQueryDto } from '../dto/query/vendor-bank-account-query.dto';
import { GetOneQuery } from '../queries/vendorBankAccount/get-one.query';
import { UpdateVendorBankAccountDto } from '../dto/create/vendorBankAccount/update.dto';
import { UpdateCommand } from '../commands/vendorBankAccount/update.command';
import { DeleteCommand } from '../commands/vendorBankAccount/delete.command';
import { UseBankAccountDto } from '../dto/create/vendorBankAccount/use-bank-account.dto';
import { UseBankAccountCommand } from '../commands/vendorBankAccount/use-bank-account.command';

@Injectable()
export class VendorBankAccountService
  implements IVendorBankAccountServiceInterface
{
  constructor(
    private readonly _queryBus: QueryBus,
    private readonly _commandBus: CommandBus,
    @InjectEntityManager(process.env.CONNECTION_NAME)
    private readonly _readEntityManager: EntityManager,
  ) {}

  async create(
    dto: CreateVendorBankAccountDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<VendorBankAccountEntity>> {
    return await this._commandBus.execute(
      new CreateCommand(dto, manager ?? this._readEntityManager),
    );
  }

  async getAll(
    dto: VendorBankAccountQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<VendorBankAccountEntity>> {
    return await this._queryBus.execute(
      new GetAllQuery(dto, manager ?? this._readEntityManager),
    );
  }

  async getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<VendorBankAccountEntity>> {
    return await this._queryBus.execute(
      new GetOneQuery(id, manager ?? this._readEntityManager),
    );
  }

  async update(
    id: number,
    dto: UpdateVendorBankAccountDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<VendorBankAccountEntity>> {
    return await this._commandBus.execute(
      new UpdateCommand(id, dto, manager ?? this._readEntityManager),
    );
  }

  async useBankAccount(
    id: number,
    dto: UseBankAccountDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<VendorBankAccountEntity>> {
    return await this._commandBus.execute(
      new UseBankAccountCommand(id, dto, manager ?? this._readEntityManager),
    );
  }

  async delete(id: number, manager?: EntityManager): Promise<void> {
    return await this._commandBus.execute(
      new DeleteCommand(id, manager ?? this._readEntityManager),
    );
  }
}
