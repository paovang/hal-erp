import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { UpdateCommand } from '../update.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { HttpStatus, Inject } from '@nestjs/common';
import { WRITE_VENDOR_PRODUCT_REPOSITORY } from '../../../constants/inject-key.const';
import { VendorProductEntity } from '@src/modules/manage/domain/entities/vendor-product.entity';
import { IWriteVendorProductRepository } from '@src/modules/manage/domain/ports/output/vendor-product-repository.interface';
import { VendorProductDataMapper } from '../../../mappers/vendor-product.mapper';
import { VendorProductOrmEntity } from '@src/common/infrastructure/database/typeorm/vendor-product.orm';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { VendorProductId } from '@src/modules/manage/domain/value-objects/vendor-product-id.vo';
import { ProductOrmEntity } from '@src/common/infrastructure/database/typeorm/product.orm';
import { VendorOrmEntity } from '@src/common/infrastructure/database/typeorm/vendor.orm';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';

@CommandHandler(UpdateCommand)
export class UpdateCommandHandler
  implements IQueryHandler<UpdateCommand, ResponseResult<VendorProductEntity>>
{
  constructor(
    @Inject(WRITE_VENDOR_PRODUCT_REPOSITORY)
    private readonly _write: IWriteVendorProductRepository,
    private readonly _dataMapper: VendorProductDataMapper,
  ) {}

  async execute(
    query: UpdateCommand,
  ): Promise<ResponseResult<VendorProductEntity>> {
    await this.checkData(query);
    // Map to entity
    const entity = this._dataMapper.toEntity(query.dto);

    // Set and validate ID
    await entity.initializeUpdateSetId(new VendorProductId(query.id));
    await entity.validateExistingIdForUpdate();

    // Final existence check for ID before update
    await findOneOrFail(query.manager, VendorProductOrmEntity, {
      id: entity.getId().value,
    });
    return await this._write.update(entity, query.manager);
  }

  private async checkData(query: UpdateCommand): Promise<void> {
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
    await findOneOrFail(
      query.manager,
      ProductOrmEntity,
      {
        id: query.dto.product_id,
      },
      `${query.dto.product_id}`,
    );
    await findOneOrFail(
      query.manager,
      VendorOrmEntity,
      {
        id: query.dto.vendor_id,
      },
      `${query.dto.vendor_id}`,
    );
  }
}
