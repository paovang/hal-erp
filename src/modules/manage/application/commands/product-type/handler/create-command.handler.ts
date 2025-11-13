import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { CreateCommand } from '../create.command';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { ProductTypeEntity } from '@src/modules/manage/domain/entities/product-type.entity';
import { WRITE_PRODUCT_TYPE_REPOSITORY } from '../../../constants/inject-key.const';
import { Inject } from '@nestjs/common';
import { TRANSACTION_MANAGER_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransactionManagerService } from '@common/infrastructure/transaction/transaction.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ProductTypeDataMapper } from '../../../mappers/product-type.mapper';
import { IWriteProductTypeRepository } from '@src/modules/manage/domain/ports/output/product-type-repository.interface';
import { _checkColumnDuplicate } from '@src/common/utils/check-column-duplicate-orm.util';
import { ProductTypeOrmEntity } from '@src/common/infrastructure/database/typeorm/product-type.orm';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { CategoryOrmEntity } from '@src/common/infrastructure/database/typeorm/category.orm';

@CommandHandler(CreateCommand)
export class CreateCommandHandler
  implements IQueryHandler<CreateCommand, ResponseResult<ProductTypeEntity>>
{
  constructor(
    @Inject(WRITE_PRODUCT_TYPE_REPOSITORY)
    private readonly _write: IWriteProductTypeRepository,
    private readonly _dataMapper: ProductTypeDataMapper,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
  ) {}

  async execute(
    query: CreateCommand,
  ): Promise<ResponseResult<ProductTypeEntity>> {
    await _checkColumnDuplicate(
      ProductTypeOrmEntity,
      'name',
      query.dto.name,
      query.manager,
      'errors.name_already_exists',
    );

    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        await findOneOrFail(
          manager,
          CategoryOrmEntity,
          {
            id: query.dto.category_id,
          },
          `category id ${query.dto.category_id}`,
        );

        const mapToEntity = this._dataMapper.toEntity(query.dto);

        return await this._write.create(mapToEntity, manager);
      },
    );
  }
}
