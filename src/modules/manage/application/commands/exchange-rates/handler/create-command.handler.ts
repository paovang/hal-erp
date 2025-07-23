import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { CreateExchangeRateCommand } from '../create.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { WRITE_EXCHANGE_RATE_REPOSITORY } from '../../../constants/inject-key.const';
import { Inject } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TRANSACTION_MANAGER_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { ExchangeRateEntity } from '@src/modules/manage/domain/entities/exchange-rate.entity';
import { ExchangeRateDataMapper } from '../../../mappers/exchange-rate.mapper';
import { IWriteExchangeRateRepository } from '@src/modules/manage/domain/ports/output/exchange-rate-repository.interface';
import { ExchangeRateOrmEntity } from '@src/common/infrastructure/database/typeorm/exchange-rate.orm';
import { _checkColumnExchangeRateDuplicate } from '@src/common/utils/check-column-duplicate-exchange-rate-orm.util';

@CommandHandler(CreateExchangeRateCommand)
export class CreateExchangeRateCommandHandler
  implements
    IQueryHandler<CreateExchangeRateCommand, ResponseResult<ExchangeRateEntity>>
{
  constructor(
    @Inject(WRITE_EXCHANGE_RATE_REPOSITORY)
    private readonly _write: IWriteExchangeRateRepository,
    private readonly _dataMapper: ExchangeRateDataMapper,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
  ) {}

  async execute(
    command: CreateExchangeRateCommand,
  ): Promise<ResponseResult<ExchangeRateEntity>> {
    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        let lastCreated: ResponseResult<ExchangeRateEntity> | null = null;

        for (const item of command.dto.exchange_rate) {
          await _checkColumnExchangeRateDuplicate(
            ExchangeRateOrmEntity,
            'from_to' as any,
            { from: item.from_currency_id, to: item.to_currency_id },
            command.manager,
            'errors.exchange_rate_already_exists',
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
