import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllExchangeRateQuery } from '../get-all.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { HttpStatus, Inject } from '@nestjs/common';
import { READ_EXCHANGE_RATE_REPOSITORY } from '../../../constants/inject-key.const';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { ExchangeRateEntity } from '@src/modules/manage/domain/entities/exchange-rate.entity';
import { IReadExchangeRateRepository } from '@src/modules/manage/domain/ports/output/exchange-rate-repository.interface';

@QueryHandler(GetAllExchangeRateQuery)
export class GetAllExchangeRateQueryHandler
  implements
    IQueryHandler<GetAllExchangeRateQuery, ResponseResult<ExchangeRateEntity>>
{
  constructor(
    @Inject(READ_EXCHANGE_RATE_REPOSITORY)
    private readonly _readRepo: IReadExchangeRateRepository,
  ) {}

  async execute(
    query: GetAllExchangeRateQuery,
  ): Promise<ResponseResult<ExchangeRateEntity>> {
    const data = await this._readRepo.findAll(query.dto, query.manager);

    if (!data) {
      throw new ManageDomainException('errors.not_found', HttpStatus.NOT_FOUND);
    }

    return data;
  }
}
