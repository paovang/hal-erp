import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { READ_RECEIPT_REPOSITORY } from '../../../constants/inject-key.const';
import { HttpStatus, Inject } from '@nestjs/common';
import {
  IReadReceiptRepository,
  ReceiptPrintResult,
} from '@src/modules/manage/domain/ports/output/receipt-repository.interface';
import { ReceiptId } from '@src/modules/manage/domain/value-objects/receitp-id.vo';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { ReceiptOrmEntity } from '@src/common/infrastructure/database/typeorm/receipt.orm';
import { GetPrintQuery } from '../get-print.query';

@QueryHandler(GetPrintQuery)
export class GetPrintQueryHandler
  implements IQueryHandler<GetPrintQuery, ReceiptPrintResult>
{
  constructor(
    @Inject(READ_RECEIPT_REPOSITORY)
    private readonly _readRepo: IReadReceiptRepository,
  ) {}

  async execute(query: GetPrintQuery): Promise<ReceiptPrintResult> {
    await this.checkData(query);
    return await this._readRepo.getPrint(
      new ReceiptId(query.id),
      query.query,
      query.manager,
    );
  }

  private async checkData(query: GetPrintQuery): Promise<void> {
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
