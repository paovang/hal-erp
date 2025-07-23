import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { DeleteExchangeRateCommand } from '../delete.command';
import { HttpStatus, Inject } from '@nestjs/common';
import { WRITE_EXCHANGE_RATE_REPOSITORY } from '../../../constants/inject-key.const';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { IWriteExchangeRateRepository } from '@src/modules/manage/domain/ports/output/exchange-rate-repository.interface';
import { ExchangeRateId } from '@src/modules/manage/domain/value-objects/exchange-rate-id.vo';
import { ExchangeRateOrmEntity } from '@src/common/infrastructure/database/typeorm/exchange-rate.orm';

@CommandHandler(DeleteExchangeRateCommand)
export class DeleteExchangeRateCommandHandler
  implements IQueryHandler<DeleteExchangeRateCommand, void>
{
  constructor(
    @Inject(WRITE_EXCHANGE_RATE_REPOSITORY)
    private readonly _write: IWriteExchangeRateRepository,
  ) {}
  async execute(query: DeleteExchangeRateCommand): Promise<void> {
    await this.checkData(query);
    return await this._write.delete(
      new ExchangeRateId(query.id),
      query.manager,
    );
  }

  private async checkData(query: DeleteExchangeRateCommand): Promise<void> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
      );
    }

    await findOneOrFail(query.manager, ExchangeRateOrmEntity, {
      id: query.id,
    });
  }
}
