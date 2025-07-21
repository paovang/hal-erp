import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOneQuery } from '../get-one.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ReceiptEntity } from '@src/modules/manage/domain/entities/receipt.entity';
import { READ_RECEIPT_REPOSITORY } from '../../../constants/inject-key.const';
import { HttpStatus, Inject } from '@nestjs/common';
import { IReadReceiptRepository } from '@src/modules/manage/domain/ports/output/receipt-repository.interface';
import { ReceiptId } from '@src/modules/manage/domain/value-objects/receitp-id.vo';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { ReceiptOrmEntity } from '@src/common/infrastructure/database/typeorm/receipt.orm';

@QueryHandler(GetOneQuery)
export class GetOneQueryHandler
  implements IQueryHandler<GetOneQuery, ResponseResult<ReceiptEntity>>
{
  constructor(
    @Inject(READ_RECEIPT_REPOSITORY)
    private readonly _readRepo: IReadReceiptRepository,
  ) {}

  async execute(query: GetOneQuery): Promise<ResponseResult<ReceiptEntity>> {
    await this.checkData(query);
    return await this._readRepo.findOne(new ReceiptId(query.id), query.manager);
  }

  private async checkData(query: GetOneQuery): Promise<void> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
      );
    }

    await findOneOrFail(query.manager, ReceiptOrmEntity, {
      id: query.id,
    });
  }
}
