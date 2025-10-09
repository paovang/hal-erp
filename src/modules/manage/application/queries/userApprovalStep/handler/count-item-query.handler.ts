import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { EnumPrOrPo } from '../../../constants/status-key.const';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { HttpStatus, Inject } from '@nestjs/common';
import { CountItemQuery } from '../count-item.query';
import {
  READ_PURCHASE_ORDER_REPOSITORY,
  READ_PURCHASE_REQUEST_REPOSITORY,
  READ_RECEIPT_REPOSITORY,
} from '../../../constants/inject-key.const';
import { IReadPurchaseRequestRepository } from '@src/modules/manage/domain/ports/output/purchase-request-repository.interface';
import { IReadPurchaseOrderRepository } from '@src/modules/manage/domain/ports/output/purchase-order-repository.interface';
import { IReadReceiptRepository } from '@src/modules/manage/domain/ports/output/receipt-repository.interface';
import { UserContextService } from '@src/common/infrastructure/cls/cls.service';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';

@QueryHandler(CountItemQuery)
export class CountItemQueryHandler
  implements IQueryHandler<CountItemQuery, ResponseResult<{ amount: number }>>
{
  constructor(
    @Inject(READ_PURCHASE_REQUEST_REPOSITORY)
    private readonly _readPRRepo: IReadPurchaseRequestRepository,
    @Inject(READ_PURCHASE_ORDER_REPOSITORY)
    private readonly _readPORepo: IReadPurchaseOrderRepository,
    @Inject(READ_RECEIPT_REPOSITORY)
    private readonly _readReceiptRepo: IReadReceiptRepository,
    private readonly _userContextService: UserContextService,
  ) {}

  async execute({
    query,
    manager,
  }: CountItemQuery): Promise<ResponseResult<{ amount: number }>> {
    const user = this._userContextService.getAuthUser()?.user;

    const user_id = user?.id;
    if (query.type === EnumPrOrPo.PR) {
      return await this._readPRRepo.countItem(user_id, manager);
    } else if (query.type === EnumPrOrPo.PO) {
      return await this._readPORepo.countItem(user_id, manager);
    } else if (query.type === EnumPrOrPo.R) {
      return await this._readReceiptRepo.countItem(user_id, manager);
    } else {
      throw new ManageDomainException(
        'errors.invalid_type',
        HttpStatus.BAD_REQUEST,
        {
          property: 'type',
        },
      );
    }
  }
}
