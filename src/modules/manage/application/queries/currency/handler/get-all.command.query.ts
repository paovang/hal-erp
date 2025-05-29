import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllQuery } from '../get-all.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CurrencyEntity } from '@src/modules/manage/domain/entities/currency.entity';
import { HttpStatus, Inject } from '@nestjs/common';
import { READ_CURRENCY_REPOSITORY } from '../../../constants/inject-key.const';
import { IReadCurrencyRepository } from '@src/modules/manage/domain/ports/output/currency-repository.interface';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';

@QueryHandler(GetAllQuery)
export class GetAllQueryHandler
  implements IQueryHandler<GetAllQuery, ResponseResult<CurrencyEntity>>
{
  constructor(
    @Inject(READ_CURRENCY_REPOSITORY)
    private readonly _readRepo: IReadCurrencyRepository,
  ) {}

  async execute(query: GetAllQuery): Promise<ResponseResult<CurrencyEntity>> {
    const data = await this._readRepo.findAll(query.dto, query.manager);

    if (!data) {
      throw new ManageDomainException('error.not_found', HttpStatus.NOT_FOUND);
    }

    return data;
  }
}
