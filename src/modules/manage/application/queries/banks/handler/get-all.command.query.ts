import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllBankQuery } from '../get-all.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { HttpStatus, Inject } from '@nestjs/common';
import { READ_BANK_REPOSITORY } from '../../../constants/inject-key.const';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { BankEntity } from '@src/modules/manage/domain/entities/bank.entity';
import { IReadBankRepository } from '@src/modules/manage/domain/ports/output/bank-repository.interace';

@QueryHandler(GetAllBankQuery)
export class GetAllBankQueryHandler
  implements IQueryHandler<GetAllBankQuery, ResponseResult<BankEntity>>
{
  constructor(
    @Inject(READ_BANK_REPOSITORY)
    private readonly _readRepo: IReadBankRepository,
  ) {}

  async execute(query: GetAllBankQuery): Promise<ResponseResult<BankEntity>> {
    const data = await this._readRepo.findAll(query.dto, query.manager);

    if (!data) {
      throw new ManageDomainException('error.not_found', HttpStatus.NOT_FOUND);
    }

    return data;
  }
}
