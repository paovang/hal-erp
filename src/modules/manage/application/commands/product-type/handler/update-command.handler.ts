import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { UpdateCommand } from '../update.command';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { ProductTypeEntity } from '@src/modules/manage/domain/entities/product-type.entity';
import { HttpStatus, Inject } from '@nestjs/common';
import { WRITE_PRODUCT_TYPE_REPOSITORY } from '../../../constants/inject-key.const';
import { IWriteProductTypeRepository } from '@src/modules/manage/domain/ports/output/product-type-repository.interface';
import { ProductTypeDataMapper } from '../../../mappers/product-type.mapper';
import { ProductTypeId } from '@src/modules/manage/domain/value-objects/product-type-id.vo';
import { ProductTypeOrmEntity } from '@src/common/infrastructure/database/typeorm/product-type.orm';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { _checkColumnDuplicate } from '@src/common/utils/check-column-duplicate-orm.util';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { CategoryOrmEntity } from '@src/common/infrastructure/database/typeorm/category.orm';

@CommandHandler(UpdateCommand)
export class UpdateCommandHandler
  implements IQueryHandler<UpdateCommand, ResponseResult<ProductTypeEntity>>
{
  constructor(
    @Inject(WRITE_PRODUCT_TYPE_REPOSITORY)
    private readonly _write: IWriteProductTypeRepository,
    private readonly _dataMapper: ProductTypeDataMapper,
  ) {}

  async execute(query: UpdateCommand): Promise<any> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
        { property: `${query.id}` },
      );
    }

    if (query.dto.name) {
      await _checkColumnDuplicate(
        ProductTypeOrmEntity,
        'name',
        query.dto.name,
        query.manager,
        'errors.name_already_exists',
        query.id,
      );
    }

    await findOneOrFail(
      query.manager,
      CategoryOrmEntity,
      {
        id: query.dto.category_id,
      },
      `category id ${query.dto.category_id}`,
    );

    const entity = this._dataMapper.toEntity(query.dto);
    await entity.initializeUpdateSetId(new ProductTypeId(query.id));
    await entity.validateExistingIdForUpdate();

    /** Check Exits Product Type Id */
    await findOneOrFail(query.manager, ProductTypeOrmEntity, {
      id: entity.getId().value,
    });

    return await this._write.update(entity, query.manager);
  }
}
