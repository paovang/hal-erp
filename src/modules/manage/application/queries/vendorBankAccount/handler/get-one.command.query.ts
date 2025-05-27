import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOneQuery } from '../get-one.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { VendorBankAccountEntity } from '@src/modules/manage/domain/entities/vendor-bank-account.entity';
import { HttpStatus, Inject } from '@nestjs/common';
import { READ_VENDOR_BANK_ACCOUNT_REPOSITORY } from '../../../constants/inject-key.const';
import { IReadVendorBankAccountRepository } from '@src/modules/manage/domain/ports/output/vendor-bank-account-repository.interface';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { VendorBankAccountOrmEntity } from '@src/common/infrastructure/database/typeorm/vendor_bank_account.orm';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { VendorBankAccountId } from '@src/modules/manage/domain/value-objects/vendor-bank-account-id.vo';

@QueryHandler(GetOneQuery)
export class GetOneQueryHandler
  implements IQueryHandler<GetOneQuery, ResponseResult<VendorBankAccountEntity>>
{
  constructor(
    @Inject(READ_VENDOR_BANK_ACCOUNT_REPOSITORY)
    private readonly _readRepo: IReadVendorBankAccountRepository,
  ) {}

  async execute(
    query: GetOneQuery,
  ): Promise<ResponseResult<VendorBankAccountEntity>> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
      );
    }

    await findOneOrFail(query.manager, VendorBankAccountOrmEntity, {
      id: query.id,
    });

    return await this._readRepo.findOne(
      new VendorBankAccountId(query.id),
      query.manager,
    );
  }
}
