import { UpdateCommand } from '@src/modules/manage/application/commands/company/update.command';
import { IQueryHandler, CommandHandler } from '@nestjs/cqrs';
import {
  WRITE_COMPANY_REPOSITORY,
  READ_COMPANY_REPOSITORY,
} from '@src/modules/manage/application/constants/inject-key.const';
import { Inject } from '@nestjs/common';
import { CompanyEntity } from '@src/modules/manage/domain/entities/company.entity';
import {
  IWriteCompanyRepository,
  IReadCompanyRepository,
} from '@src/modules/manage/domain/ports/output/company-repository.interface';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { CompanyDataMapper } from '@src/modules/manage/application/mappers/company.mapper';
import { TRANSACTION_MANAGER_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransactionManagerService } from '@common/infrastructure/transaction/transaction.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CompanyId } from '@src/modules/manage/domain/value-objects/company-id.vo';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { CompanyOrmEntity } from '@src/common/infrastructure/database/typeorm/company.orm';

@CommandHandler(UpdateCommand)
export class UpdateCommandHandler
  implements IQueryHandler<UpdateCommand, ResponseResult<CompanyEntity>>
{
  constructor(
    @Inject(READ_COMPANY_REPOSITORY)
    private readonly _read: IReadCompanyRepository,
    @Inject(WRITE_COMPANY_REPOSITORY)
    private readonly _write: IWriteCompanyRepository,
    private readonly _dataMapper: CompanyDataMapper,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
  ) {}

  async execute(
    command: UpdateCommand,
  ): Promise<ResponseResult<CompanyEntity>> {
    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        await findOneOrFail(
          manager,
          CompanyOrmEntity,
          {
            id: command.id,
          },
          `id ${command.id}`,
        );
        const companyId = new CompanyId(command.id);

        const mapToEntity = this._dataMapper.toEntity(command.dto);
        mapToEntity.initializeUpdateSetId(companyId);

        return await this._write.update(mapToEntity, manager);
      },
    );
  }
}
