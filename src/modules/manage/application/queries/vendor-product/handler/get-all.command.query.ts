import { IQueryHandler } from '@nestjs/cqrs';
import { GetAllQuery } from '../get-all.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { Inject } from '@nestjs/common';
import {
  READ_VENDOR_PRODUCT_REPOSITORY,
  VENDOR_PRODUCT_APPLICATION_SERVICE,
} from '../../../constants/inject-key.const';
import { VendorProductEntity } from '@src/modules/manage/domain/entities/vendor-product.entity';
import { IReadVendorProductRepository } from '@src/modules/manage/domain/ports/output/vendor-product-repository.interface';
import { IVendorProductServiceInterface } from '@src/modules/manage/domain/ports/input/vendor-product-domain-service.interface';
import { QueryHandler } from '@nestjs/cqrs';

@QueryHandler(GetAllQuery)
export class GetAllQueryHandler
  implements IQueryHandler<GetAllQuery, ResponseResult<VendorProductEntity>>
{
  constructor(
    @Inject(READ_VENDOR_PRODUCT_REPOSITORY)
    private readonly _read: IReadVendorProductRepository,
    @Inject(VENDOR_PRODUCT_APPLICATION_SERVICE)
    private readonly _vendorProductService: IVendorProductServiceInterface,
  ) {}

  async execute(query: GetAllQuery): Promise<ResponseResult<VendorProductEntity>> {
    return await this._vendorProductService.getAll(query.dto, query.manager);
  }
}