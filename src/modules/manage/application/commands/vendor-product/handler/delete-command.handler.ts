import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { DeleteCommand } from '../delete.command';
import { HttpStatus, Inject } from '@nestjs/common';
import { WRITE_VENDOR_PRODUCT_REPOSITORY } from '../../../constants/inject-key.const';
import { IWriteVendorProductRepository } from '@src/modules/manage/domain/ports/output/vendor-product-repository.interface';
import { VendorProductId } from '@src/modules/manage/domain/value-objects/vendor-product-id.vo';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { VendorProductOrmEntity } from '@src/common/infrastructure/database/typeorm/vendor-product.orm';

@CommandHandler(DeleteCommand)
export class DeleteCommandHandler
  implements IQueryHandler<DeleteCommand, void>
{
  constructor(
    @Inject(WRITE_VENDOR_PRODUCT_REPOSITORY)
    private readonly _write: IWriteVendorProductRepository,
    // @Inject(VENDOR_PRODUCT_APPLICATION_SERVICE)
    // private readonly _vendorProductService: IVendorProductServiceInterface,
  ) {}

  async execute(query: DeleteCommand): Promise<void> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
        { property: `${query.id}` },
      );
    }

    await findOneOrFail(
      query.manager,
      VendorProductOrmEntity,
      {
        id: query.id,
      },
      `${query.id}`,
    );
    const id = new VendorProductId(query.id);
    await this._write.delete(id, query.manager);
  }
}
