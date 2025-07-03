import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOneQuery } from '../get-one.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { PurchaseOrderEntity } from '@src/modules/manage/domain/entities/purchase-order.entity';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { HttpStatus, Inject } from '@nestjs/common';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { PurchaseOrderOrmEntity } from '@src/common/infrastructure/database/typeorm/purchase-order.orm';
import { READ_PURCHASE_ORDER_REPOSITORY } from '../../../constants/inject-key.const';
import { IReadPurchaseOrderRepository } from '@src/modules/manage/domain/ports/output/purchase-order-repository.interface';
import { PurchaseOrderId } from '@src/modules/manage/domain/value-objects/purchase-order-id.vo';

@QueryHandler(GetOneQuery)
export class GetOneQueryHandler
  implements IQueryHandler<GetOneQuery, ResponseResult<PurchaseOrderEntity>>
{
  constructor(
    @Inject(READ_PURCHASE_ORDER_REPOSITORY)
    private readonly _readRepo: IReadPurchaseOrderRepository,
  ) {}

  async execute(
    query: GetOneQuery,
  ): Promise<ResponseResult<PurchaseOrderEntity>> {
    await this.checkData(query);
    return await this._readRepo.findOne(
      new PurchaseOrderId(query.id),
      query.manager,
    );
  }

  private async checkData(query: GetOneQuery): Promise<void> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
      );
    }

    await findOneOrFail(query.manager, PurchaseOrderOrmEntity, {
      id: query.id,
    });
  }
}
