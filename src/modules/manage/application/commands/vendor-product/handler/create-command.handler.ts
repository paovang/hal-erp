import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { CreateCommand } from '../create.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { Inject } from '@nestjs/common';
import {
  WRITE_VENDOR_PRODUCT_REPOSITORY,
  READ_VENDOR_PRODUCT_REPOSITORY,
} from '../../../constants/inject-key.const';
import { VendorProductEntity } from '@src/modules/manage/domain/entities/vendor-product.entity';
import { IWriteVendorProductRepository } from '@src/modules/manage/domain/ports/output/vendor-product-repository.interface';
import { IReadVendorProductRepository } from '@src/modules/manage/domain/ports/output/vendor-product-repository.interface';
import { VendorProductDataMapper } from '../../../mappers/vendor-product.mapper';
import { VendorProductQueryDto } from '../../../dto/query/vendor-product-query.dto';

@CommandHandler(CreateCommand)
export class CreateCommandHandler
  implements IQueryHandler<CreateCommand, ResponseResult<VendorProductEntity>>
{
  constructor(
    @Inject(WRITE_VENDOR_PRODUCT_REPOSITORY)
    private readonly _write: IWriteVendorProductRepository,
    @Inject(READ_VENDOR_PRODUCT_REPOSITORY)
    private readonly _read: IReadVendorProductRepository,
    private readonly _dataMapper: VendorProductDataMapper,
  ) {}

  async execute(query: CreateCommand): Promise<ResponseResult<VendorProductEntity>> {
    const vendorProductEntity = this._dataMapper.toEntity(query.dto);
    return await this._write.create(vendorProductEntity, query.manager);
  }
}