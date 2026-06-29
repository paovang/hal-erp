import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import path from 'path';

import { UpdateFileCommand } from '../update-file.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { PurchaseOrderSelectedVendorEntity } from '@src/modules/manage/domain/entities/purchase-order-selected-vendor.entity';
import { PO_FILE_NAME_FOLDER } from '../../../constants/inject-key.const';
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
import { PurchaseOrderSelectedVendorOrmEntity } from '@src/common/infrastructure/database/typeorm/purchase-order-selected-vendor.orm';
import { PurchaseOrderSelectedVendorDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/purchase-order-selected-vendor.mapper';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';

@CommandHandler(UpdateFileCommand)
export class UpdateFileCommandHandler
  implements
    ICommandHandler<
      UpdateFileCommand,
      ResponseResult<PurchaseOrderSelectedVendorEntity>
    >
{
  constructor(
    private readonly _dataAccessMapper: PurchaseOrderSelectedVendorDataAccessMapper,
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
    query: UpdateFileCommand,
  ): Promise<ResponseResult<PurchaseOrderSelectedVendorEntity>> {
    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        // 1. Ensure the selected vendor row exists
        const existing = await findOneOrFail(
          manager,
          PurchaseOrderSelectedVendorOrmEntity,
          { id: query.id },
          `purchase order selected vendor id: ${query.id}`,
        );

        const oldFileKey = existing.filename ?? null;

        const baseFolder = path.join(
          __dirname,
          '../../../../../../../assets/uploads/',
        );

        // 2. Upload the new staged file to S3 (if provided)
        let newFileKey: string | null = null;
        if (query.dto.filename) {
          const mockFile = await createMockMulterFile(
            baseFolder,
            query.dto.filename,
          );
          const optimizedImage =
            await this._optimizeService.optimizeImage(mockFile);
          const s3ImageResponse = await this._amazonS3ServiceKey.uploadFile(
            optimizedImage,
            PO_FILE_NAME_FOLDER,
          );
          newFileKey = s3ImageResponse.fileKey;

          // Remove the staged file from local uploads
          await deleteFile(baseFolder + query.dto.filename);
        }

        // 3. Update only the filename column (null clears the file)
        const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);
        await manager.update(
          PurchaseOrderSelectedVendorOrmEntity,
          query.id,
          {
            filename: newFileKey as unknown as string,
            updated_at: new Date(now),
          },
        );

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

        // 5. Return the refreshed row (with vendor relations for the response)
        const updated = await manager.findOneOrFail(
          PurchaseOrderSelectedVendorOrmEntity,
          {
            where: { id: query.id },
            relations: ['vendors', 'vendor_bank_account'],
          },
        );

        return this._dataAccessMapper.toEntity(updated);
      },
    );
  }
}
