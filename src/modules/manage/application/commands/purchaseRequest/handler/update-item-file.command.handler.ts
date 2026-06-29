import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import path from 'path';

import { UpdateItemFileCommand } from '../update-item-file.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { PurchaseRequestEntity } from '@src/modules/manage/domain/entities/purchase-request.entity';
import { PurchaseRequestId } from '@src/modules/manage/domain/value-objects/purchase-request-id.vo';
import {
  PR_FILE_NAME_FOLDER,
  READ_PURCHASE_REQUEST_REPOSITORY,
} from '../../../constants/inject-key.const';
import { IReadPurchaseRequestRepository } from '@src/modules/manage/domain/ports/output/purchase-request-repository.interface';
import {
  TRANSACTION_MANAGER_SERVICE,
  USER_PROFILE_IMAGE_FILE_OPTIMIZE_SERVICE_KEY,
} from '@src/common/constants/inject-key.const';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { IImageOptimizeService } from '@src/common/utils/services/images/interface/image-optimize-service.interface';
import { AMAZON_S3_SERVICE_KEY } from '@src/common/infrastructure/aws3/config/inject-key';
import { IAmazonS3ImageService } from '@src/common/infrastructure/aws3/interface/amazon-s3-image-service.interface';
import { createMockMulterFile } from '@src/common/utils/services/file-utils.service';
import { deleteFile } from '@src/common/utils/file.utils';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { PurchaseRequestItemOrmEntity } from '@src/common/infrastructure/database/typeorm/purchase-request-item.orm';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';

@CommandHandler(UpdateItemFileCommand)
export class UpdateItemFileCommandHandler
  implements
    ICommandHandler<
      UpdateItemFileCommand,
      ResponseResult<PurchaseRequestEntity>
    >
{
  constructor(
    @Inject(READ_PURCHASE_REQUEST_REPOSITORY)
    private readonly _read: IReadPurchaseRequestRepository,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
    @Inject(USER_PROFILE_IMAGE_FILE_OPTIMIZE_SERVICE_KEY)
    private readonly _optimizeService: IImageOptimizeService,
    @Inject(AMAZON_S3_SERVICE_KEY)
    private readonly _amazonS3ServiceKey: IAmazonS3ImageService,
  ) {}

  async execute(
    query: UpdateItemFileCommand,
  ): Promise<ResponseResult<PurchaseRequestEntity>> {
    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        // 1. Ensure the purchase request item exists
        const existingItem = await findOneOrFail(
          manager,
          PurchaseRequestItemOrmEntity,
          { id: query.id },
          `purchase request item id: ${query.id}`,
        );

        const oldFileKey = existingItem.file_name ?? null;

        const baseFolder = path.join(
          __dirname,
          '../../../../../../../assets/uploads/',
        );

        // 2. Upload the new staged file to S3 (if provided)
        let newFileKey: string | null = null;
        if (query.dto.file_name) {
          const mockFile = await createMockMulterFile(
            baseFolder,
            query.dto.file_name,
          );
          const optimizedImage =
            await this._optimizeService.optimizeImage(mockFile);
          const s3ImageResponse = await this._amazonS3ServiceKey.uploadFile(
            optimizedImage,
            PR_FILE_NAME_FOLDER,
          );
          newFileKey = s3ImageResponse.fileKey;

          // Remove the staged file from local uploads
          await deleteFile(baseFolder + query.dto.file_name);
        }

        // 3. Update only the file_name column of the item
        const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);
        await manager.update(PurchaseRequestItemOrmEntity, query.id, {
          // pass null explicitly so the file can also be cleared
          file_name: newFileKey as unknown as string,
          updated_at: new Date(now),
        });

        // 4. Best-effort cleanup of the replaced file on S3
        if (oldFileKey && oldFileKey !== newFileKey) {
          try {
            await this._amazonS3ServiceKey.deleteFile(oldFileKey);
          } catch (error) {
            console.error(
              `Failed to delete old S3 file: ${oldFileKey}. Error: ${error}`,
            );
          }
        }

        return await this._read.findOne(
          new PurchaseRequestId(existingItem.purchase_request_id ?? 0),
          manager,
        );
      },
    );
  }
}
