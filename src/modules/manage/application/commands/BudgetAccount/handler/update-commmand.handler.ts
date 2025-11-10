import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { UpdateCommand } from '../update.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { BudgetAccountEntity } from '@src/modules/manage/domain/entities/budget-account.entity';
import { HttpStatus, Inject } from '@nestjs/common';
import {
  WRITE_BUDGET_ACCOUNT_REPOSITORY,
  WRITE_INCREASE_BUDGET_REPOSITORY,
} from '../../../constants/inject-key.const';
import { IWriteBudgetAccountRepository } from '@src/modules/manage/domain/ports/output/budget-account-repository.interface';
import { BudgetAccountDataMapper } from '../../../mappers/budget-account.mapper';
import { BudgetAccountId } from '@src/modules/manage/domain/value-objects/budget-account-id.vo';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { BudgetAccountOrmEntity } from '@src/common/infrastructure/database/typeorm/budget-account.orm';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { DepartmentOrmEntity } from '@src/common/infrastructure/database/typeorm/department.orm';
import { IncreaseBudgetDataMapper } from '../../../mappers/increase-budget.mapper';
import { IWriteIncreaseBudgetRepository } from '@src/modules/manage/domain/ports/output/increase-budget-repository.interface';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { TRANSACTION_MANAGER_SERVICE } from '@src/common/constants/inject-key.const';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserContextService } from '@src/common/infrastructure/cls/cls.service';
import { UpdateIncreaseBudgetDto } from '../../../dto/create/increaseBudget/update.dto';
import { IncreaseBudgetId } from '@src/modules/manage/domain/value-objects/increase-budget-id.vo';
import { IncreaseBudgetOrmEntity } from '@src/common/infrastructure/database/typeorm/increase-budget.orm';
import { CompanyUserOrmEntity } from '@src/common/infrastructure/database/typeorm/company-user.orm';

@CommandHandler(UpdateCommand)
export class UpdateCommandHandler
  implements IQueryHandler<UpdateCommand, ResponseResult<BudgetAccountEntity>>
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
    private readonly _userContextService: UserContextService,
  ) {}

  async execute(query: UpdateCommand): Promise<any> {
    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        const user = this._userContextService.getAuthUser()?.user;
        const user_id = user?.id;
        await this.checkData(query);

        let company_id: number | null | undefined = null;
        const company = await manager.findOne(CompanyUserOrmEntity, {
          where: {
            user_id: user_id,
          },
        });

        company_id = company?.company_id ?? null;

        const entity = this._dataMapper.toEntity(
          query.dto,
          undefined,
          company_id || undefined,
        );
        await entity.initializeUpdateSetId(new BudgetAccountId(query.id));
        await entity.validateExistingIdForUpdate();

        /** Check Exits Department Id */
        await findOneOrFail(manager, BudgetAccountOrmEntity, {
          id: entity.getId().value,
        });

        const result = await this._write.update(entity, manager);

        const increase = await findOneOrFail(
          manager,
          IncreaseBudgetOrmEntity,
          {
            budget_account_id: query.id,
          },
          `increase budget account id: ${query.id}`,
        );

        const increase_id = increase.id;

        const increase_dto = query.dto as unknown as UpdateIncreaseBudgetDto;
        const merge = {
          ...increase_dto,
          budget_account_id: query.id,
        };

        const entityIncrease = this._dataIncreaseMapper.toEntity(
          merge,
          user_id,
          query.dto.allocated_amount,
        );

        await entityIncrease.initializeUpdateSetId(
          new IncreaseBudgetId(increase_id),
        );
        await entityIncrease.validateExistingIdForUpdate();

        await this._writeIncrease.update(entityIncrease, manager);

        return result;
      },
    );
  }

  private async checkData(query: UpdateCommand): Promise<void> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
        { property: `${query.id}` },
      );
    }

    await findOneOrFail(query.manager, DepartmentOrmEntity, {
      id: query.dto.departmentId,
    });
  }
}
