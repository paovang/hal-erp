import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { UpdateCommand } from '../update.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { BudgetItemEntity } from '@src/modules/manage/domain/entities/budget-item.entity';
import { HttpStatus, Inject } from '@nestjs/common';
import { WRITE_BUDGET_ITEM_REPOSITORY } from '../../../constants/inject-key.const';
import { IWriteBudgetItemRepository } from '@src/modules/manage/domain/ports/output/budget-item-repository.interace';
import { BudgetItemDataMapper } from '../../../mappers/budget-item.mapper';
import { TRANSACTION_MANAGER_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { BudgetItemOrmEntity } from '@src/common/infrastructure/database/typeorm/budget-item.orm';
import { BudgetItemId } from '@src/modules/manage/domain/value-objects/budget-item-id.vo';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';

@CommandHandler(UpdateCommand)
export class UpdateCommandHandler
  implements IQueryHandler<UpdateCommand, ResponseResult<BudgetItemEntity>>
{
  constructor(
    @Inject(WRITE_BUDGET_ITEM_REPOSITORY)
    private readonly _write: IWriteBudgetItemRepository,
    private readonly _dataMapper: BudgetItemDataMapper,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
  ) {}

  async execute(query: UpdateCommand): Promise<any> {
    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        if (isNaN(query.id)) {
          throw new ManageDomainException(
            'errors.must_be_number',
            HttpStatus.BAD_REQUEST,
          );
        }

        await findOneOrFail(manager, BudgetItemOrmEntity, {
          id: query.id,
        });

        const entity = this._dataMapper.toEntity(query.dto);
        await entity.initializeUpdateSetId(new BudgetItemId(query.id));
        await entity.validateExistingIdForUpdate();

        /** Check Exits Department Id */
        await findOneOrFail(manager, BudgetItemOrmEntity, {
          id: entity.getId().value,
        });

        return await this._write.update(entity, manager);
      },
    );
  }
}
