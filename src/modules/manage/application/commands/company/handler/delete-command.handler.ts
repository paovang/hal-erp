import { DeleteCommand } from '@src/modules/manage/application/commands/company/delete.command';
import { IQueryHandler, CommandHandler } from '@nestjs/cqrs';
import { WRITE_COMPANY_REPOSITORY } from '@src/modules/manage/application/constants/inject-key.const';
import { Inject } from '@nestjs/common';
import { IWriteCompanyRepository } from '@src/modules/manage/domain/ports/output/company-repository.interface';
import { CompanyId } from '@src/modules/manage/domain/value-objects/company-id.vo';
import { TRANSACTION_MANAGER_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransactionManagerService } from '@common/infrastructure/transaction/transaction.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CompanyOrmEntity } from '@src/common/infrastructure/database/typeorm/company.orm';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';

@CommandHandler(DeleteCommand)
export class DeleteCommandHandler
  implements IQueryHandler<DeleteCommand, void>
{
  constructor(
    @Inject(WRITE_COMPANY_REPOSITORY)
    private readonly _write: IWriteCompanyRepository,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
  ) {}

  async execute(command: DeleteCommand): Promise<void> {
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
        await this._write.delete(companyId, manager);
      },
    );
  }
}
