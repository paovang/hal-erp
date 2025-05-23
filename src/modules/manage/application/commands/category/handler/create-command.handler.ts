import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { CreateCommand } from '../create.command';
import { ResponseResult } from '@src/common/application/interfaces/pagination.interface';
import { CategoryEntity } from '@src/modules/manage/domain/entities/category.entity';
import { WRITE_CATEGORY_REPOSITORY } from '../../../constants/inject-key.const';
import { Inject } from '@nestjs/common';
import { TRANSACTION_MANAGER_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransactionManagerService } from '@src/common/application/interfaces/transaction.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CategoryDataMapper } from '../../../mappers/category.mapper';
import { IWriteCategoryRepository } from '@src/modules/manage/domain/ports/output/category-repository.interface';
import { _checkColumnDuplicate } from '@src/common/utils/check-column-duplicate-orm.util';
import { CategoryOrmEntity } from '@src/common/infrastructure/database/typeorm/category.orm';

@CommandHandler(CreateCommand)
export class CreateCommandHandler
  implements IQueryHandler<CreateCommand, ResponseResult<CategoryEntity>>
{
  constructor(
    @Inject(WRITE_CATEGORY_REPOSITORY)
    private readonly _write: IWriteCategoryRepository,
    private readonly _dataMapper: CategoryDataMapper,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
  ) {}

  async execute(query: CreateCommand): Promise<ResponseResult<CategoryEntity>> {
    await _checkColumnDuplicate(
      CategoryOrmEntity,
      'name',
      query.dto.name,
      query.manager,
      'Name already exists',
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
