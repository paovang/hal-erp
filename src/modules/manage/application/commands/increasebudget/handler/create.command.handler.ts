import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { CreateCommand } from '../create.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { IncreaseBudgetEntity } from '@src/modules/manage/domain/entities/increase-budget.entity';
import { Inject } from '@nestjs/common';
import {
  FILE_FOLDER,
  WRITE_INCREASE_BUDGET_DETAIL_REPOSITORY,
  WRITE_INCREASE_BUDGET_FILE_REPOSITORY,
  WRITE_INCREASE_BUDGET_REPOSITORY,
} from '../../../constants/inject-key.const';
import { IncreaseBudgetDataMapper } from '../../../mappers/increase-budget.mapper';
import {
  TRANSACTION_MANAGER_SERVICE,
  USER_PROFILE_IMAGE_FILE_OPTIMIZE_SERVICE_KEY,
} from '@src/common/constants/inject-key.const';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { UserContextService } from '@src/common/infrastructure/cls/cls.service';
import { IImageOptimizeService } from '@src/common/utils/services/images/interface/image-optimize-service.interface';
import { AMAZON_S3_SERVICE_KEY } from '@src/common/infrastructure/aws3/config/inject-key';
import { IAmazonS3ImageService } from '@src/common/infrastructure/aws3/interface/amazon-s3-image-service.interface';
import { IWriteIncreaseBudgetRepository } from '@src/modules/manage/domain/ports/output/increase-budget-repository.interface';
import { IWriteIncreaseBudgetFileRepository } from '@src/modules/manage/domain/ports/output/increase-budget-file-repository.interface';
import { IncreaseBudgetFileDataMapper } from '../../../mappers/increase-budget-file.mapper';
import { IWriteIncreaseBudgetDetailRepository } from '@src/modules/manage/domain/ports/output/increase-budget-detail-repository.interface';
import { IncreaseBudgetDetailDataMapper } from '../../../mappers/increase-budget-detail.mapper';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { BudgetAccountOrmEntity } from '@src/common/infrastructure/database/typeorm/budget-account.orm';
import { createMockMulterFile } from '@src/common/utils/services/file-utils.service';
import path from 'path';
import { DocumentTransactionOrmEntity } from '@src/common/infrastructure/database/typeorm/document-transaction.orm';
import { IncreaseBudgetDetailOrmEntity } from '@src/common/infrastructure/database/typeorm/increase-budget-detail.orm';
// import { IncreaseBudgetId } from '@src/modules/manage/domain/value-objects/increase-budget-id.vo';
// import { IncreaseBudgetOrmEntity } from '@src/common/infrastructure/database/typeorm/increase-budget.orm';

@CommandHandler(CreateCommand)
export class CreateCommandHandler
  implements IQueryHandler<CreateCommand, ResponseResult<IncreaseBudgetEntity>>
{
  constructor(
    @Inject(WRITE_INCREASE_BUDGET_REPOSITORY)
    private readonly _write: IWriteIncreaseBudgetRepository,
    private readonly _dataMapper: IncreaseBudgetDataMapper,
    @Inject(WRITE_INCREASE_BUDGET_FILE_REPOSITORY)
    private readonly _writeFile: IWriteIncreaseBudgetFileRepository,
    private readonly _dataFileMapper: IncreaseBudgetFileDataMapper,
    @Inject(WRITE_INCREASE_BUDGET_DETAIL_REPOSITORY)
    private readonly _writeDetail: IWriteIncreaseBudgetDetailRepository,
    private readonly _dataDetailMapper: IncreaseBudgetDetailDataMapper,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
    private readonly _userContextService: UserContextService,
    @Inject(USER_PROFILE_IMAGE_FILE_OPTIMIZE_SERVICE_KEY)
    private readonly _optimizeService: IImageOptimizeService,
    @Inject(AMAZON_S3_SERVICE_KEY)
    private readonly _amazonS3ServiceKey: IAmazonS3ImageService,
  ) {}

  async execute(
    query: CreateCommand,
  ): Promise<ResponseResult<IncreaseBudgetEntity>> {
    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        let processedItems = null;

        const baseFolder = path.join(
          __dirname,
          '../../../../../../../assets/uploads/',
        );

        const user = this._userContextService.getAuthUser()?.user;
        const user_id = user?.id;

        await findOneOrFail(
          manager,
          BudgetAccountOrmEntity,
          {
            id: query.dto.budget_account_id,
          },
          'budget account',
        );

        let fileKey = null;

        const mockFile = await createMockMulterFile(
          baseFolder,
          query.dto.file_name,
        );
        const optimizedImage =
          await this._optimizeService.optimizeImage(mockFile);
        const s3ImageResponse = await this._amazonS3ServiceKey.uploadFile(
          optimizedImage,
          FILE_FOLDER,
        );
        fileKey = s3ImageResponse.fileKey;

        const total = query.dto.increase_budget_details.reduce(
          (acc, item) => acc + item.allocated_amount,
          0,
        );

        const entity = this._dataMapper.toEntity(query.dto, user_id, total);

        const result = await this._write.create(entity, manager);

        const increase_budget_id = (result as any)._id._value;

        processedItems = {
          ...query.dto,
          file_name: fileKey ?? '',
        };

        const file_entity = this._dataFileMapper.toEntity(
          processedItems,
          increase_budget_id,
        );

        await this._writeFile.create(file_entity, manager);

        // let sum_total = 0;
        for (const detail of query.dto.increase_budget_details) {
          const detail_entity = this._dataDetailMapper.toEntity(
            detail,
            increase_budget_id,
          );
          await this._writeDetail.create(detail_entity, manager);
          // sum_total += detail.allocated_amount;
        }

        // const get_budget_account = await manager.findOne(
        //   BudgetAccountOrmEntity,
        //   {
        //     where: { id: query.dto.budget_account_id },
        //   },
        // );

        // const get_budget_item = await manager.find(BudgetItemOrmEntity, {
        //   where: { budget_account_id: get_budget_account?.id },
        // });

        // let sum_total = 0;
        // for (const budget_item of get_budget_item) {
        //   const total = await this.sumTotal(manager, budget_item.id);
        //   sum_total += total;
        // }

        // const update_entity = this._dataMapper.toEntityUpdate(sum_total);

        // // Set and validate ID
        // await update_entity.initializeUpdateSetId(
        //   new IncreaseBudgetId(increase_budget_id),
        // );
        // await update_entity.validateExistingIdForUpdate();

        // // Final existence check for ID before update
        // await findOneOrFail(manager, IncreaseBudgetOrmEntity, {
        //   id: update_entity.getId().value,
        // });

        return result;
      },
    );
  }

  private async sumTotal(
    manager: EntityManager,
    budget_item_id: number,
  ): Promise<number> {
    const sum_total_increase_budget_detail = await manager
      .getRepository(IncreaseBudgetDetailOrmEntity)
      .createQueryBuilder('increase_budget_detail')
      .select('SUM(increase_budget_detail.allocated_amount)', 'sum_total')
      .where('increase_budget_detail.budget_item_id = :budget_item_id', {
        budget_item_id,
      })
      .getRawOne();

    const sum_total_budget_transaction = await manager
      .getRepository(DocumentTransactionOrmEntity)
      .createQueryBuilder('document_transaction')
      .select('SUM(document_transaction.amount)', 'sum_total')
      .where('document_transaction.budget_item_id = :budget_item_id', {
        budget_item_id,
      })
      .getRawOne();

    const calculate =
      Number(sum_total_increase_budget_detail.sum_total) -
      Number(sum_total_budget_transaction.sum_total);

    return calculate;
  }
}
