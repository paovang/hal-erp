import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { PurchaseRequestEntity } from '@src/modules/manage/domain/entities/purchase-request.entity';
import { UpdateCommand } from '../update.command';
import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import {
  PR_FILE_NAME_FOLDER,
  WRITE_PURCHASE_REQUEST_ITEM_REPOSITORY,
  WRITE_PURCHASE_REQUEST_REPOSITORY,
} from '../../../constants/inject-key.const';
import { HttpStatus, Inject } from '@nestjs/common';
import { IWritePurchaseRequestRepository } from '@src/modules/manage/domain/ports/output/purchase-request-repository.interface';
import { PurchaseRequestDataMapper } from '../../../mappers/purchase-request.mapper';
import { IWritePurchaseRequestItemRepository } from '@src/modules/manage/domain/ports/output/purchase-request-item-repository.interface';
import { PurchaseRequestItemDataMapper } from '../../../mappers/purchase-request-item.mapper';
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
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { PurchaseRequestId } from '@src/modules/manage/domain/value-objects/purchase-request-id.vo';
import { PurchaseRequestOrmEntity } from '@src/common/infrastructure/database/typeorm/purchase-request.orm';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { PurchaseRequestItemId } from '@src/modules/manage/domain/value-objects/purchase-request-item-id.vo';
import path from 'path';
import { createMockMulterFile } from '@src/common/utils/services/file-utils.service';
import { PurchaseRequestItemOrmEntity } from '@src/common/infrastructure/database/typeorm/purchase-request-item.orm';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import moment from 'moment-timezone';
import { deleteFile } from '@src/common/utils/file.utils';
import { UserApprovalOrmEntity } from '@src/common/infrastructure/database/typeorm/user-approval.orm';
import { UserApprovalStepOrmEntity } from '@src/common/infrastructure/database/typeorm/user-approval-step.orm';
import { STATUS_KEY } from '../../../constants/status-key.const';

@CommandHandler(UpdateCommand)
export class UpdateCommandHandler
  implements IQueryHandler<UpdateCommand, ResponseResult<PurchaseRequestEntity>>
{
  constructor(
    @Inject(WRITE_PURCHASE_REQUEST_REPOSITORY)
    private readonly _write: IWritePurchaseRequestRepository,
    private readonly _dataMapper: PurchaseRequestDataMapper,
    // item
    @Inject(WRITE_PURCHASE_REQUEST_ITEM_REPOSITORY)
    private readonly _writeItem: IWritePurchaseRequestItemRepository,
    private readonly _dataItemMapper: PurchaseRequestItemDataMapper,
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
    query: UpdateCommand,
  ): Promise<ResponseResult<PurchaseRequestEntity>> {
    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        await this.checkData(query);

        await this.checkDate(query); // check expired_date

        const baseFolder = path.join(
          __dirname,
          '../../../../../../../assets/uploads/',
        );

        const entity = this._dataMapper.toEntity(query.dto);

        // Set and validate ID
        await entity.initializeUpdateSetId(new PurchaseRequestId(query.id));
        await entity.validateExistingIdForUpdate();

        // Final existence check for ID before update
        await findOneOrFail(manager, PurchaseRequestOrmEntity, {
          id: entity.getId().value,
        });

        const result = await this._write.update(entity, manager);

        // Extract pr_id from updated result
        const pr_id = entity.getId().value;

        await this.updateItem(query, manager, baseFolder, pr_id);

        await this.deleteFile(query, baseFolder);

        return result;
      },
    );
  }

  private async deleteFile(
    query: UpdateCommand,
    baseFolder: string,
  ): Promise<any> {
    for (const file of query.dto.purchase_request_items) {
      const filePath = file.file_name;
      if (filePath) {
        const Path = baseFolder + filePath;

        await deleteFile(Path);
      }
    }
  }

  private async updateItem(
    query: UpdateCommand,
    manager: EntityManager,
    baseFolder: string,
    pr_id: number,
  ): Promise<void> {
    for (const item of query.dto.purchase_request_items) {
      await findOneOrFail(manager, PurchaseRequestItemOrmEntity, {
        id: item.id,
      });

      const existingItem = await query.manager.findOne(
        'purchase_request_items',
        {
          where: {
            id: item.id,
            purchase_request_id: pr_id,
          },
        },
      );

      if (!existingItem) {
        throw new ManageDomainException(
          'errors.not_found',
          HttpStatus.NOT_FOUND,
        );
      }

      let processedItems = null;
      let sum_total = 0;
      let fileKey = null;

      if (item.file_name) {
        // Upload to S3
        const mockFile = await createMockMulterFile(baseFolder, item.file_name);
        const optimizedImage =
          await this._optimizeService.optimizeImage(mockFile);
        const s3ImageResponse = await this._amazonS3ServiceKey.uploadFile(
          optimizedImage,
          PR_FILE_NAME_FOLDER,
        );
        fileKey = s3ImageResponse.fileKey;

        // Mark input file for deletion after upload and update
        // const uploadedFilePath = path.join(item.file_name);
        // filesToDelete.push(item.file_name);
      }

      processedItems = {
        ...item,
        file_name: fileKey,
      };

      sum_total = item.quantity! * item.price!;

      const itemEntity = this._dataItemMapper.toEntity(
        processedItems,
        pr_id,
        sum_total,
      );
      await itemEntity.initializeUpdateSetId(
        new PurchaseRequestItemId(item.id),
      );
      await itemEntity.validateExistingIdForUpdate();

      await this._writeItem.update(itemEntity, manager);
    }
  }

  private async checkDate(query: UpdateCommand): Promise<void> {
    const expiredDateFormatted = moment(query.dto.expired_date).format(
      'YYYY-MM-DD',
    );

    if (expiredDateFormatted.includes('Invalid date')) {
      throw new ManageDomainException(
        'errors.expired_date_invalid',
        HttpStatus.BAD_REQUEST,
      );
    }

    const expiredDate = moment.tz(query.dto.expired_date, Timezone.LAOS);

    const today = moment.tz(Timezone.LAOS).startOf('day');

    if (expiredDate.isBefore(today)) {
      throw new ManageDomainException(
        'errors.expired_date_must_not_be_in_past',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async checkData(query: UpdateCommand): Promise<void> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
      );
    }

    const pr = await findOneOrFail(query.manager, PurchaseRequestOrmEntity, {
      id: query.id,
    });

    const document_id = (pr as any).document_id;

    const user_approval = await findOneOrFail(
      query.manager,
      UserApprovalOrmEntity,
      {
        document_id: document_id,
      },
    );

    const user_approval_id = (user_approval as any).id;

    const user_approval_step = await query.manager.findOne(
      UserApprovalStepOrmEntity,
      {
        where: {
          user_approval_id: user_approval_id,
          status_id: STATUS_KEY.APPROVED,
        },
      },
    );

    if (user_approval_step) {
      throw new ManageDomainException(
        'errors.cannot_update',
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
