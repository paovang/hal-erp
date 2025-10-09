import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { READ_BANK_REPOSITORY } from '../../../constants/inject-key.const';
import { HttpStatus, Inject } from '@nestjs/common';
import { GetOneBankQuery } from '../get-one.query';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { BankEntity } from '@src/modules/manage/domain/entities/bank.entity';
import { IReadBankRepository } from '@src/modules/manage/domain/ports/output/bank-repository.interace';
import { BankOrmEntity } from '@src/common/infrastructure/database/typeorm/bank.orm';
import { BankId } from '@src/modules/manage/domain/value-objects/bank-id.vo';

@QueryHandler(GetOneBankQuery)
export class GetOneBankQueryHandler
  implements IQueryHandler<GetOneBankQuery, ResponseResult<BankEntity>>
{
  constructor(
    @Inject(READ_BANK_REPOSITORY)
    private readonly _readRepo: IReadBankRepository,
  ) {}
  async execute(query: GetOneBankQuery): Promise<ResponseResult<BankEntity>> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
      );
    }

    await findOneOrFail(query.manager, BankOrmEntity, {
      id: query.id,
    });

    return await this._readRepo.findOne(new BankId(query.id), query.manager);
  }
}
