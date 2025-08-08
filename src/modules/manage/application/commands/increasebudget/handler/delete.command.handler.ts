import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { DeleteCommand } from '../delete.command';
import { HttpStatus, Inject } from '@nestjs/common';
import {
  WRITE_INCREASE_BUDGET_DETAIL_REPOSITORY,
  WRITE_INCREASE_BUDGET_FILE_REPOSITORY,
  WRITE_INCREASE_BUDGET_REPOSITORY,
} from '../../../constants/inject-key.const';
import { IWriteIncreaseBudgetRepository } from '@src/modules/manage/domain/ports/output/increase-budget-repository.interface';
import { IncreaseBudgetId } from '@src/modules/manage/domain/value-objects/increase-budget-id.vo';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { IncreaseBudgetOrmEntity } from '@src/common/infrastructure/database/typeorm/increase-budget.orm';
import { TRANSACTION_MANAGER_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { IWriteIncreaseBudgetFileRepository } from '@src/modules/manage/domain/ports/output/increase-budget-file-repository.interface';
import { IncreaseBudgetFileOrmEntity } from '@src/common/infrastructure/database/typeorm/increase-budget-file.orm';
import { IncreaseBudgetFileId } from '@src/modules/manage/domain/value-objects/increase-budget-file-id.vo';
import { IWriteIncreaseBudgetDetailRepository } from '@src/modules/manage/domain/ports/output/increase-budget-detail-repository.interface';
import { IncreaseBudgetDetailOrmEntity } from '@src/common/infrastructure/database/typeorm/increase-budget-detail.orm';
import { IncreaseBudgetDetailId } from '@src/modules/manage/domain/value-objects/increase-budget-detail-id.vo';

@CommandHandler(DeleteCommand)
export class DeleteCommandHandler
  implements IQueryHandler<DeleteCommand, void>
{
  constructor(
    @Inject(WRITE_INCREASE_BUDGET_REPOSITORY)
    private readonly _write: IWriteIncreaseBudgetRepository,
    @Inject(WRITE_INCREASE_BUDGET_FILE_REPOSITORY)
    private readonly _writeFile: IWriteIncreaseBudgetFileRepository,
    @Inject(WRITE_INCREASE_BUDGET_DETAIL_REPOSITORY)
    private readonly _writeDetail: IWriteIncreaseBudgetDetailRepository,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
  ) {}

  async execute(query: DeleteCommand): Promise<void> {
    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        await this.checkData(query, manager);

        await this.deleteFile(query, manager);

        const details = await manager.find(IncreaseBudgetDetailOrmEntity, {
          where: { increase_budget_id: query.id },
        });

        for (const detail of details) {
          if (!detail) {
            throw new ManageDomainException(
              'errors.not_found',
              HttpStatus.NOT_FOUND,
              { property: 'detail' },
            );
          }
          await this._writeDetail.delete(
            new IncreaseBudgetDetailId(detail.id),
            manager,
          );
        }

        await this._write.delete(new IncreaseBudgetId(query.id), manager);
      },
    );
  }

  private async checkData(
    query: DeleteCommand,
    manager: EntityManager,
  ): Promise<void> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
        { property: `${query.id}` },
      );
    }

    await findOneOrFail(
      manager,
      IncreaseBudgetOrmEntity,
      {
        id: query.id,
      },
      'increase budget',
    );
  }

  private async deleteFile(
    query: DeleteCommand,
    manager: EntityManager,
  ): Promise<void> {
    const file = await manager.findOne(IncreaseBudgetFileOrmEntity, {
      where: { increase_budget_id: query.id },
    });

    if (file) {
      await this._writeFile.delete(new IncreaseBudgetFileId(file.id), manager);
    }
  }
}
