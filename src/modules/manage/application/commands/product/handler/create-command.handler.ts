import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { CreateCommand } from '../create.command';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { ProductEntity } from '@src/modules/manage/domain/entities/product.entity';
import { WRITE_PRODUCT_REPOSITORY } from '../../../constants/inject-key.const';
import { Inject } from '@nestjs/common';
import { TRANSACTION_MANAGER_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransactionManagerService } from '@common/infrastructure/transaction/transaction.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ProductDataMapper } from '../../../mappers/product.mapper';
import { IWriteProductRepository } from '@src/modules/manage/domain/ports/output/product-repository.interface';
import { _checkColumnDuplicate } from '@src/common/utils/check-column-duplicate-orm.util';
import { ProductOrmEntity } from '@src/common/infrastructure/database/typeorm/product.orm';

@CommandHandler(CreateCommand)
export class CreateCommandHandler
  implements IQueryHandler<CreateCommand, ResponseResult<ProductEntity>>
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

  async execute(query: CreateCommand): Promise<ResponseResult<ProductEntity>> {
    await _checkColumnDuplicate(
      ProductOrmEntity,
      'name',
      query.dto.name,
      query.manager,
      'errors.name_already_exists',
    );

    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        const mapToEntity = this._dataMapper.toEntity(query.dto);

        return await this._write.create(mapToEntity, manager);
      },
    );
  }
}
