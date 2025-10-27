import { CreateCommand } from '@src/modules/manage/application/commands/company/create.command';
import { IQueryHandler, CommandHandler } from '@nestjs/cqrs';
import {
  WRITE_COMPANY_REPOSITORY,
} from '@src/modules/manage/application/constants/inject-key.const';
import { Inject } from '@nestjs/common';
import { CompanyEntity } from '@src/modules/manage/domain/entities/company.entity';
import { IWriteCompanyRepository } from '@src/modules/manage/domain/ports/output/company-repository.interface';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { CompanyDataMapper } from '@src/modules/manage/application/mappers/company.mapper';
import { TRANSACTION_MANAGER_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransactionManagerService } from '@common/infrastructure/transaction/transaction.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CompanyId } from '@src/modules/manage/domain/value-objects/company-id.vo';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';

@CommandHandler(CreateCommand)
export class CreateCommandHandler
  implements IQueryHandler<CreateCommand, ResponseResult<CompanyEntity>>
{
  constructor(
    @Inject(WRITE_COMPANY_REPOSITORY)
    private readonly _write: IWriteCompanyRepository,
    private readonly _dataMapper: CompanyDataMapper,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
  ) {}

  async execute(
    command: CreateCommand,
  ): Promise<ResponseResult<CompanyEntity>> {
    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        const mapToEntity = this._dataMapper.toEntity(command.dto);
        mapToEntity.initializeUpdateSetId(new CompanyId(0)); // Will be set by database

        return await this._write.create(mapToEntity, manager);
      },
    );
  }
}