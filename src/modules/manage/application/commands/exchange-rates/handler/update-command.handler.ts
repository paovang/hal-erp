import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { UpdateExchangeRateCommand } from '../update.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { WRITE_EXCHANGE_RATE_REPOSITORY } from '../../../constants/inject-key.const';
import { HttpStatus, Inject } from '@nestjs/common';
// import { _checkColumnDuplicate } from '@src/common/utils/check-column-duplicate-orm.util';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { ExchangeRateId } from '@src/modules/manage/domain/value-objects/exchange-rate-id.vo';
import { ExchangeRateOrmEntity } from '@src/common/infrastructure/database/typeorm/exchange-rate.orm';
import { IWriteExchangeRateRepository } from '@src/modules/manage/domain/ports/output/exchange-rate-repository.interface';
import { ExchangeRateDataMapper } from '../../../mappers/exchange-rate.mapper';
import { ExchangeRateEntity } from '@src/modules/manage/domain/entities/exchange-rate.entity';
import { _checkColumnExchangeRateDuplicate } from '@src/common/utils/check-column-duplicate-exchange-rate-orm.util';

@CommandHandler(UpdateExchangeRateCommand)
export class UpdateExchangeRateCommandHandler
  implements
    IQueryHandler<UpdateExchangeRateCommand, ResponseResult<ExchangeRateEntity>>
{
  constructor(
    @Inject(WRITE_EXCHANGE_RATE_REPOSITORY)
    private readonly _write: IWriteExchangeRateRepository,
    private readonly _dataMapper: ExchangeRateDataMapper,
  ) {}

  async execute(
    query: UpdateExchangeRateCommand,
  ): Promise<ResponseResult<ExchangeRateEntity>> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
      );
    }
    await _checkColumnExchangeRateDuplicate(
      ExchangeRateOrmEntity,
      'from_to' as any,
      { from: query.dto.from_currency_id, to: query.dto.to_currency_id },
      query.manager,
      'errors.exchange_rate_already_exists',
    );

    const entity = this._dataMapper.toEntity(query.dto);
    await entity.initializeUpdateSetId(new ExchangeRateId(query.id));
    await entity.validateExistingIdForUpdate();

    /** Check Exits Department Id */
    await findOneOrFail(query.manager, ExchangeRateOrmEntity, {
      id: entity.getId().value,
    });

    return await this._write.update(entity, query.manager);
  }
}
