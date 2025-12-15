import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { UpdateCommand } from '../update.command';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { ProductEntity } from '@src/modules/manage/domain/entities/product.entity';
import { WRITE_PRODUCT_REPOSITORY } from '../../../constants/inject-key.const';
import { HttpStatus, Inject } from '@nestjs/common';
import { TRANSACTION_MANAGER_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransactionManagerService } from '@common/infrastructure/transaction/transaction.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ProductDataMapper } from '../../../mappers/product.mapper';
import { IWriteProductRepository } from '@src/modules/manage/domain/ports/output/product-repository.interface';
import { ProductId } from '@src/modules/manage/domain/value-objects/product-id.vo';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { _checkColumnDuplicate } from '@src/common/utils/check-column-duplicate-orm.util';
import { ProductOrmEntity } from '@src/common/infrastructure/database/typeorm/product.orm';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { ProductTypeOrmEntity } from '@src/common/infrastructure/database/typeorm/product-type.orm';
import { UnitOrmEntity } from '@src/common/infrastructure/database/typeorm/unit.orm';

@CommandHandler(UpdateCommand)
export class UpdateCommandHandler
  implements IQueryHandler<UpdateCommand, ResponseResult<ProductEntity>>
{
  constructor(
    @Inject(WRITE_PRODUCT_REPOSITORY)
    private readonly _write: IWriteProductRepository,
    private readonly _dataMapper: ProductDataMapper,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
  ) {}

  async execute(query: UpdateCommand): Promise<ResponseResult<ProductEntity>> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
        { property: `${query.id}` },
      );
    }

    if (query.dto.name) {
      await _checkColumnDuplicate(
        ProductOrmEntity,
        'name',
        query.dto.name,
        query.manager,
        'errors.name_already_exists',
        query.id,
      );
    }

    await findOneOrFail(query.manager, ProductOrmEntity, {
      id: query.id,
    });

    if (query.dto.product_type_id) {
      await findOneOrFail(
        query.manager,
        ProductTypeOrmEntity,
        {
          id: query.dto.product_type_id,
        },
        `product type id ${query.dto.product_type_id}`,
      );
    }
    if (query.dto.unit_id) {
      await findOneOrFail(
        query.manager,
        UnitOrmEntity,
        {
          id: query.dto.unit_id,
        },
        `unit id ${query.dto.unit_id}`,
      );
    }

    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        const mapToEntity = this._dataMapper.toEntity(query.dto);
        const productId = new ProductId(query.id);
        await mapToEntity.initializeUpdateSetId(productId);

        return await this._write.update(mapToEntity, manager);
      },
    );
  }
}
