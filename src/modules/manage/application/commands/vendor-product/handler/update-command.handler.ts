import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { UpdateCommand } from '../update.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { Inject } from '@nestjs/common';
import {
  WRITE_VENDOR_PRODUCT_REPOSITORY,
  VENDOR_PRODUCT_APPLICATION_SERVICE,
} from '../../../constants/inject-key.const';
import { VendorProductEntity } from '@src/modules/manage/domain/entities/vendor-product.entity';
import { IWriteVendorProductRepository } from '@src/modules/manage/domain/ports/output/vendor-product-repository.interface';
import { VendorProductDataMapper } from '../../../mappers/vendor-product.mapper';
import { IVendorProductServiceInterface } from '@src/modules/manage/domain/ports/input/vendor-product-domain-service.interface';

@CommandHandler(UpdateCommand)
export class UpdateCommandHandler
  implements IQueryHandler<UpdateCommand, ResponseResult<VendorProductEntity>>
{
  constructor(
    @Inject(WRITE_VENDOR_PRODUCT_REPOSITORY)
    private readonly _write: IWriteVendorProductRepository,
    private readonly _dataMapper: VendorProductDataMapper,
    @Inject(VENDOR_PRODUCT_APPLICATION_SERVICE)
    private readonly _vendorProductService: IVendorProductServiceInterface,
  ) {}

  async execute(query: UpdateCommand): Promise<ResponseResult<VendorProductEntity>> {
    return await this._vendorProductService.update(
      query.id,
      query.dto,
      query.manager,
    );
  }
}