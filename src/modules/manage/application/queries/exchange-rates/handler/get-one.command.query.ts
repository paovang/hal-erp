import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { READ_EXCHANGE_RATE_REPOSITORY } from '../../../constants/inject-key.const';
import { HttpStatus, Inject } from '@nestjs/common';
import { GetOneExchangeRateQuery } from '../get-one.query';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { IReadExchangeRateRepository } from '@src/modules/manage/domain/ports/output/exchange-rate-repository.interface';
import { ExchangeRateEntity } from '@src/modules/manage/domain/entities/exchange-rate.entity';
import { ExchangeRateOrmEntity } from '@src/common/infrastructure/database/typeorm/exchange-rate.orm';
import { ExchangeRateId } from '@src/modules/manage/domain/value-objects/exchange-rate-id.vo';

@QueryHandler(GetOneExchangeRateQuery)
export class GetOneExchangeRateQueryHandler
  implements
    IQueryHandler<GetOneExchangeRateQuery, ResponseResult<ExchangeRateEntity>>
{
  constructor(
    @Inject(READ_EXCHANGE_RATE_REPOSITORY)
    private readonly _readRepo: IReadExchangeRateRepository,
  ) {}
  async execute(
    query: GetOneExchangeRateQuery,
  ): Promise<ResponseResult<ExchangeRateEntity>> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
      );
    }

    await findOneOrFail(query.manager, ExchangeRateOrmEntity, {
      id: query.id,
    });

    return await this._readRepo.findOne(
      new ExchangeRateId(query.id),
      query.manager,
    );
  }
}
