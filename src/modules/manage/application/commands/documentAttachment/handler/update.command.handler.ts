import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import path from 'path';

import { UpdateCommand } from '../update.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { DocumentAttachmentEntity } from '@src/modules/manage/domain/entities/document-attachment.entity';
import { DocumentAttachmentId } from '@src/modules/manage/domain/value-objects/document-attachment-id.vo';
import {
  FILE_FOLDER,
  WRITE_DOCUMENT_ATTACHMENT_REPOSITORY,
} from '../../../constants/inject-key.const';
import { IWriteDocumentAttachmentRepository } from '@src/modules/manage/domain/ports/output/document-attachment.interface';
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
import { DocumentAttachmentOrmEntity } from '@src/common/infrastructure/database/typeorm/document-attachment.orm';
import { DocumentAttachmentDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/document-attachment.mapper';

@CommandHandler(UpdateCommand)
export class UpdateCommandHandler
  implements
    ICommandHandler<UpdateCommand, ResponseResult<DocumentAttachmentEntity>>
{
  constructor(
    @Inject(WRITE_DOCUMENT_ATTACHMENT_REPOSITORY)
    private readonly _write: IWriteDocumentAttachmentRepository,
    private readonly _dataAccessMapper: DocumentAttachmentDataAccessMapper,
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
    query: UpdateCommand,
  ): Promise<ResponseResult<DocumentAttachmentEntity>> {
    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        // 1. Ensure the attachment exists
        const existing = await findOneOrFail(
          manager,
          DocumentAttachmentOrmEntity,
          { id: query.id },
          `document attachment id: ${query.id}`,
        );

        const oldFileKey = existing.file_name ?? null;

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
            FILE_FOLDER,
          );
          newFileKey = s3ImageResponse.fileKey;

          // Remove the staged file from local uploads
          await deleteFile(baseFolder + query.dto.file_name);
        }

        // 3. Persist the new file_name (null clears the file)
        const entity = DocumentAttachmentEntity.builder()
          .setDocumentAttachmentId(new DocumentAttachmentId(query.id))
          .setFileName(newFileKey as unknown as string)
          .build();

        await this._write.update(entity, manager);

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

        // 5. Return the refreshed attachment (with its creator)
        const updated = await manager.findOneOrFail(
          DocumentAttachmentOrmEntity,
          {
            where: { id: query.id },
            relations: ['users'],
          },
        );

        return this._dataAccessMapper.toEntity(updated);
      },
    );
  }
}
