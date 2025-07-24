import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllQuery } from '../get-all.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { VendorBankAccountEntity } from '@src/modules/manage/domain/entities/vendor-bank-account.entity';
import { READ_VENDOR_BANK_ACCOUNT_REPOSITORY } from '../../../constants/inject-key.const';
import { HttpStatus, Inject } from '@nestjs/common';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { IReadVendorBankAccountRepository } from '@src/modules/manage/domain/ports/output/vendor-bank-account-repository.interface';

@QueryHandler(GetAllQuery)
export class GetAllQueryHandler
  implements IQueryHandler<GetAllQuery, ResponseResult<VendorBankAccountEntity>>
{
  constructor(
    @Inject(READ_VENDOR_BANK_ACCOUNT_REPOSITORY)
    private readonly _readRepo: IReadVendorBankAccountRepository,
  ) {}

  async execute(
    query: GetAllQuery,
  ): Promise<ResponseResult<VendorBankAccountEntity>> {
    const data = await this._readRepo.findAll(
      query.id,
      query.dto,
      query.manager,
    );

    if (!data) {
      throw new ManageDomainException('error.not_found', HttpStatus.NOT_FOUND);
    }

    return data;
  }
}
