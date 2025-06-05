import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { CreateCommand } from '../create.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { BudgetAccountEntity } from '@src/modules/manage/domain/entities/budget-account.entity';
import { WRITE_BUDGET_ACCOUNT_REPOSITORY } from '../../../constants/inject-key.const';
import { Inject } from '@nestjs/common';
import { BudgetAccountDataMapper } from '../../../mappers/budget-account.mapper';
import { TRANSACTION_MANAGER_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { DepartmentOrmEntity } from '@src/common/infrastructure/database/typeorm/department.orm';
import { IWriteBudgetAccountRepository } from '@src/modules/manage/domain/ports/output/budget-account-repository.interface';
import { CodeGeneratorUtil } from '@src/common/utils/code-generator.util';
import { BudgetAccountOrmEntity } from '@src/common/infrastructure/database/typeorm/budget-account.orm';

@CommandHandler(CreateCommand)
export class CreateCommandHandler
  implements IQueryHandler<CreateCommand, ResponseResult<BudgetAccountEntity>>
{
  constructor(
    @Inject(WRITE_BUDGET_ACCOUNT_REPOSITORY)
    private readonly _write: IWriteBudgetAccountRepository,
    private readonly _dataMapper: BudgetAccountDataMapper,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
    private readonly _codeGeneratorUtil: CodeGeneratorUtil,
  ) {}

  async execute(
    query: CreateCommand,
  ): Promise<ResponseResult<BudgetAccountEntity>> {
    await findOneOrFail(query.manager, DepartmentOrmEntity, {
      id: query.dto.departmentId,
    });

    const code = await this._codeGeneratorUtil.generateUniqueCode(
      6,
      async (generatedCode: string) => {
        try {
          await findOneOrFail(query.manager, BudgetAccountOrmEntity, {
            code: generatedCode,
          });
          return false;
        } catch {
          return true;
        }
      },
      'BA',
    );

    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        const mapToEntity = this._dataMapper.toEntity(query.dto, code);

        return await this._write.create(mapToEntity, manager);
      },
    );
  }
}
