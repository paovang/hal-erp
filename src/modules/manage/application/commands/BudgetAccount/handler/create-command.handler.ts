import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { CreateCommand } from '../create.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { BudgetAccountEntity } from '@src/modules/manage/domain/entities/budget-account.entity';
import {
  WRITE_BUDGET_ACCOUNT_REPOSITORY,
  WRITE_INCREASE_BUDGET_REPOSITORY,
} from '../../../constants/inject-key.const';
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
import { IWriteIncreaseBudgetRepository } from '@src/modules/manage/domain/ports/output/increase-budget-repository.interface';
import { IncreaseBudgetDataMapper } from '../../../mappers/increase-budget.mapper';
import { UserContextService } from '@src/common/infrastructure/cls/cls.service';
import { CreateIncreaseBudgetDto } from '../../../dto/create/increaseBudget/create.dto';

@CommandHandler(CreateCommand)
export class CreateCommandHandler
  implements IQueryHandler<CreateCommand, ResponseResult<BudgetAccountEntity>>
{
  constructor(
    @Inject(WRITE_BUDGET_ACCOUNT_REPOSITORY)
    private readonly _write: IWriteBudgetAccountRepository,
    private readonly _dataMapper: BudgetAccountDataMapper,
    @Inject(WRITE_INCREASE_BUDGET_REPOSITORY)
    private readonly _writeIncrease: IWriteIncreaseBudgetRepository,
    private readonly _dataIncreaseMapper: IncreaseBudgetDataMapper,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
    private readonly _codeGeneratorUtil: CodeGeneratorUtil,
    private readonly _userContextService: UserContextService,
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
        const user = this._userContextService.getAuthUser()?.user;
        const user_id = user?.id;
        const mapToEntity = this._dataMapper.toEntity(query.dto, code);

        const result = await this._write.create(mapToEntity, manager);

        const budget_account = (result as any)._id._value;

        const increase_dto = query.dto as unknown as CreateIncreaseBudgetDto;
        const merge = {
          ...increase_dto,
          budget_account_id: budget_account,
        };

        const entity = this._dataIncreaseMapper.toEntity(
          merge,
          user_id,
          query.dto.allocated_amount,
        );

        await this._writeIncrease.create(entity, manager);

        return result;
      },
    );
  }
}
