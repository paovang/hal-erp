import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { CreateCommand } from '../create.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CurrencyEntity } from '@src/modules/manage/domain/entities/currency.entity';
import { WRITE_CURRENCY_REPOSITORY } from '../../../constants/inject-key.const';
import { Inject } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TRANSACTION_MANAGER_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { IWriteCurrencyRepository } from '@src/modules/manage/domain/ports/output/currency-repository.interface';
import { CurrencyDataMapper } from '../../../mappers/currency.mapper';
import { CurrencyOrmEntity } from '@src/common/infrastructure/database/typeorm/currency.orm';
import { _checkColumnDuplicate } from '@src/common/utils/check-column-duplicate-orm.util';

@CommandHandler(CreateCommand)
export class CreateCommandHandler
  implements IQueryHandler<CreateCommand, ResponseResult<CurrencyEntity>>
{
  constructor(
    @Inject(WRITE_CURRENCY_REPOSITORY)
    private readonly _write: IWriteCurrencyRepository,
    private readonly _dataMapper: CurrencyDataMapper,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
  ) {}

  async execute(query: CreateCommand): Promise<ResponseResult<CurrencyEntity>> {
    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        let lastCreated: ResponseResult<CurrencyEntity> | null = null;

        for (const item of query.dto.currency) {
          await _checkColumnDuplicate(
            CurrencyOrmEntity,
            'code',
            item.code,
            query.manager,
            'errors.code_already_exists',
          );

          await _checkColumnDuplicate(
            CurrencyOrmEntity,
            'name',
            item.name,
            query.manager,
            'errors.name_already_exists',
          );
          const mapToEntity = this._dataMapper.toEntity(item);
          const result = await this._write.create(mapToEntity, manager);

          lastCreated = result;
        }

        return lastCreated;
      },
    );
  }
}
