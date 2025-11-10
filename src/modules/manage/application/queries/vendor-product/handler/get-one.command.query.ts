import { IQueryHandler } from '@nestjs/cqrs';
import { GetOneQuery } from '../get-one.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { Inject } from '@nestjs/common';
import { READ_VENDOR_PRODUCT_REPOSITORY } from '../../../constants/inject-key.const';
import { VendorProductEntity } from '@src/modules/manage/domain/entities/vendor-product.entity';
import { IReadVendorProductRepository } from '@src/modules/manage/domain/ports/output/vendor-product-repository.interface';
import { QueryHandler } from '@nestjs/cqrs';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { VendorProductOrmEntity } from '@src/common/infrastructure/database/typeorm/vendor-product.orm';
import { VendorProductId } from '@src/modules/manage/domain/value-objects/vendor-product-id.vo';

@QueryHandler(GetOneQuery)
export class GetOneQueryHandler
  implements IQueryHandler<GetOneQuery, ResponseResult<VendorProductEntity>>
{
  constructor(
    @Inject(READ_VENDOR_PRODUCT_REPOSITORY)
    private readonly _read: IReadVendorProductRepository,
    // @Inject(VENDOR_PRODUCT_APPLICATION_SERVICE)
    // private readonly _vendorProductService: IVendorProductServiceInterface,
  ) {}

  async execute(
    query: GetOneQuery,
  ): Promise<ResponseResult<VendorProductEntity>> {
    await findOneOrFail(
      query.manager,
      VendorProductOrmEntity,
      {
        id: query.id,
      },
      `${query.id}`,
    );
    const id = new VendorProductId(query.id);
    return await this._read.findOne(id, query.manager);
  }
}
