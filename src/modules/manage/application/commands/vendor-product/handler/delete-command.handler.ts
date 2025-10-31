import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { DeleteCommand } from '../delete.command';
import { Inject } from '@nestjs/common';
import {
  WRITE_VENDOR_PRODUCT_REPOSITORY,
  VENDOR_PRODUCT_APPLICATION_SERVICE,
} from '../../../constants/inject-key.const';
import { IWriteVendorProductRepository } from '@src/modules/manage/domain/ports/output/vendor-product-repository.interface';
import { IVendorProductServiceInterface } from '@src/modules/manage/domain/ports/input/vendor-product-domain-service.interface';

@CommandHandler(DeleteCommand)
export class DeleteCommandHandler
  implements IQueryHandler<DeleteCommand, void>
{
  constructor(
    @Inject(WRITE_VENDOR_PRODUCT_REPOSITORY)
    private readonly _write: IWriteVendorProductRepository,
    @Inject(VENDOR_PRODUCT_APPLICATION_SERVICE)
    private readonly _vendorProductService: IVendorProductServiceInterface,
  ) {}

  async execute(query: DeleteCommand): Promise<void> {
    await this._vendorProductService.delete(query.id, query.manager);
  }
}