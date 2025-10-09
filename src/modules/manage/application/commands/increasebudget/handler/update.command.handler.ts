import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { UpdateCommand } from '../update.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { IncreaseBudgetEntity } from '@src/modules/manage/domain/entities/increase-budget.entity';
import { HttpStatus, Inject } from '@nestjs/common';
import {
  FILE_FOLDER,
  WRITE_INCREASE_BUDGET_DETAIL_REPOSITORY,
  WRITE_INCREASE_BUDGET_FILE_REPOSITORY,
  WRITE_INCREASE_BUDGET_REPOSITORY,
} from '../../../constants/inject-key.const';
import { IWriteIncreaseBudgetRepository } from '@src/modules/manage/domain/ports/output/increase-budget-repository.interface';
import { IncreaseBudgetDataMapper } from '../../../mappers/increase-budget.mapper';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { IncreaseBudgetOrmEntity } from '@src/common/infrastructure/database/typeorm/increase-budget.orm';
import { IncreaseBudgetId } from '@src/modules/manage/domain/value-objects/increase-budget-id.vo';
import { IncreaseBudgetFileDataMapper } from '../../../mappers/increase-budget-file.mapper';
import { IWriteIncreaseBudgetFileRepository } from '@src/modules/manage/domain/ports/output/increase-budget-file-repository.interface';
import { IWriteIncreaseBudgetDetailRepository } from '@src/modules/manage/domain/ports/output/increase-budget-detail-repository.interface';
import { IncreaseBudgetDetailDataMapper } from '../../../mappers/increase-budget-detail.mapper';
import {
  TRANSACTION_MANAGER_SERVICE,
  USER_PROFILE_IMAGE_FILE_OPTIMIZE_SERVICE_KEY,
} from '@src/common/constants/inject-key.const';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { IImageOptimizeService } from '@src/common/utils/services/images/interface/image-optimize-service.interface';
import { AMAZON_S3_SERVICE_KEY } from '@src/common/infrastructure/aws3/config/inject-key';
import { IAmazonS3ImageService } from '@src/common/infrastructure/aws3/interface/amazon-s3-image-service.interface';
import path from 'path';
import { BudgetAccountOrmEntity } from '@src/common/infrastructure/database/typeorm/budget-account.orm';
import { createMockMulterFile } from '@src/common/utils/services/file-utils.service';
import { IncreaseBudgetFileId } from '@src/modules/manage/domain/value-objects/increase-budget-file-id.vo';
@CommandHandler(UpdateCommand)
export class UpdateCommandHandler
  implements IQueryHandler<UpdateCommand, ResponseResult<IncreaseBudgetEntity>>
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
    // private readonly _userContextService: UserContextService,
    @Inject(USER_PROFILE_IMAGE_FILE_OPTIMIZE_SERVICE_KEY)
    private readonly _optimizeService: IImageOptimizeService,
    @Inject(AMAZON_S3_SERVICE_KEY)
    private readonly _amazonS3ServiceKey: IAmazonS3ImageService,
  ) {}
  async execute(
    query: UpdateCommand,
  ): Promise<ResponseResult<IncreaseBudgetEntity>> {
    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        let processedItems: any = null;

        const baseFolder = path.join(
          __dirname,
          '../../../../../../../assets/uploads/',
        );
        if (isNaN(query.id)) {
          throw new ManageDomainException(
            'errors.must_be_number',
            HttpStatus.BAD_REQUEST,
            { property: `${query.id}` },
          );
        }

        await findOneOrFail(manager, IncreaseBudgetOrmEntity, {
          id: query.id,
        });

        // const user = this._userContextService.getAuthUser()?.user;
        // const user_id = user?.id;

        await findOneOrFail(
          manager,
          BudgetAccountOrmEntity,
          {
            id: query.dto.budget_account_id,
          },
          'budget account',
        );

        let fileKey = null;

        if (query.dto.file_name) {
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
        }

        // Map to entity
        const entity = this._dataMapper.toEntity(query.dto);

        // Set and validate ID
        await entity.initializeUpdateSetId(new IncreaseBudgetId(query.id));
        await entity.validateExistingIdForUpdate();

        // Final existence check for ID before update
        await findOneOrFail(manager, IncreaseBudgetOrmEntity, {
          id: entity.getId().value,
        });

        const result = await this._write.update(entity, manager);

        processedItems = {
          ...query.dto,
          file_name: fileKey ?? '',
        };

        // Map to entity
        const entity_file = this._dataFileMapper.toEntity(processedItems);

        // Set and validate ID
        await entity_file.initializeUpdateSetId(
          new IncreaseBudgetFileId(query.id),
        );
        await entity_file.validateExistingIdForUpdate();

        // Final existence check for ID before update
        await findOneOrFail(manager, IncreaseBudgetOrmEntity, {
          id: entity_file.getId().value,
        });

        await this._writeFile.update(entity_file, manager);

        return result;
      },
    );
  }
}
