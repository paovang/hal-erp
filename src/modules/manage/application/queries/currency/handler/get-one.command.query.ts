import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CurrencyEntity } from '@src/modules/manage/domain/entities/currency.entity';
import { READ_CURRENCY_REPOSITORY } from '../../../constants/inject-key.const';
import { IReadCurrencyRepository } from '@src/modules/manage/domain/ports/output/currency-repository.interface';
import { HttpStatus, Inject } from '@nestjs/common';
import { GetOneQuery } from '../get-one.query';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { CurrencyId } from '@src/modules/manage/domain/value-objects/currency-id.vo';
import { CurrencyOrmEntity } from '@src/common/infrastructure/database/typeorm/currency.orm';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';

@QueryHandler(GetOneQuery)
export class GetOneQueryHandler
  implements IQueryHandler<GetOneQuery, ResponseResult<CurrencyEntity>>
{
  constructor(
    @Inject(READ_CURRENCY_REPOSITORY)
    private readonly _readRepo: IReadCurrencyRepository,
  ) {}
  async execute(query: GetOneQuery): Promise<ResponseResult<CurrencyEntity>> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'error.must_be_number',
        HttpStatus.BAD_REQUEST,
      );
    }

    await findOneOrFail(query.manager, CurrencyOrmEntity, {
      id: query.id,
    });

    return await this._readRepo.findOne(
      new CurrencyId(query.id),
      query.manager,
    );
  }
}
