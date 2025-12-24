import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import {
  USER_SIGNATURE_IMAGE_FOLDER,
  WRITE_USER_REPOSITORY,
  WRITE_USER_SIGNATURE_REPOSITORY,
} from '../../../constants/inject-key.const';
import { HttpStatus, Inject } from '@nestjs/common';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { UpdateCommand } from '../update-command';
import { UserEntity } from '@src/modules/manage/domain/entities/user.entity';
import { IWriteUserRepository } from '@src/modules/manage/domain/ports/output/user-repository.interface';
import { UserDataMapper } from '../../../mappers/user.mapper';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorm/user.orm';
import { UserId } from '@src/modules/manage/domain/value-objects/user-id.vo';
import { _checkColumnDuplicate } from '@src/common/utils/check-column-duplicate-orm.util';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { RoleOrmEntity } from '@src/common/infrastructure/database/typeorm/role.orm';
import { PermissionOrmEntity } from '@src/common/infrastructure/database/typeorm/permission.orm';
import { UserSignatureDataMapper } from '../../../mappers/user-signature.mapper';
import {
  TRANSACTION_MANAGER_SERVICE,
  USER_PROFILE_IMAGE_FILE_OPTIMIZE_SERVICE_KEY,
} from '@src/common/constants/inject-key.const';
import { IWriteUserSignatureRepository } from '@src/modules/manage/domain/ports/output/user-signature-repository.interface';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { IImageOptimizeService } from '@src/common/utils/services/images/interface/image-optimize-service.interface';
import { AMAZON_S3_SERVICE_KEY } from '@src/common/infrastructure/aws3/config/inject-key';
import { IAmazonS3ImageService } from '@src/common/infrastructure/aws3/interface/amazon-s3-image-service.interface';
import * as path from 'path';
import { createMockMulterFile } from '@src/common/utils/services/file-utils.service';
import { access, unlink } from 'fs/promises';
import { constants } from 'fs';

@CommandHandler(UpdateCommand)
export class UpdateCommandHandler
  implements IQueryHandler<UpdateCommand, ResponseResult<UserEntity>>
{
  constructor(
    @Inject(WRITE_USER_REPOSITORY)
    private readonly _write: IWriteUserRepository,
    private readonly _dataMapper: UserDataMapper,
    private readonly _dataUserSignatureMapper: UserSignatureDataMapper,
    @Inject(WRITE_USER_SIGNATURE_REPOSITORY)
    private readonly _writeUserSignature: IWriteUserSignatureRepository,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
    @Inject(USER_PROFILE_IMAGE_FILE_OPTIMIZE_SERVICE_KEY)
    private readonly _optimizeService: IImageOptimizeService,
    @Inject(AMAZON_S3_SERVICE_KEY)
    private readonly _amazonS3ServiceKey: IAmazonS3ImageService,
  ) {}
  async execute(query: UpdateCommand): Promise<any> {
    let s3ImageResponse = null;
    let mockFile = null;
    await this.checkData(query);

    const baseFolder = path.join(
      __dirname,
      '../../../../../../../assets/uploads/',
    );

    if (query.dto.signature) {
      // Use the global helper to get the mock Multer file
      mockFile = await createMockMulterFile(baseFolder, query.dto.signature);

      // Optimize the image file
      const optimizedImage =
        await this._optimizeService.optimizeImage(mockFile);

      // Upload optimized image to S3 and get response object
      s3ImageResponse = await this._amazonS3ServiceKey.uploadFile(
        optimizedImage,
        USER_SIGNATURE_IMAGE_FOLDER,
      );
    }

    for (const roleId of query.dto.roleIds) {
      await findOneOrFail(query.manager, RoleOrmEntity, {
        id: roleId,
      });
    }

    if (query.dto.permissionIds) {
      for (const permissionId of query.dto.permissionIds) {
        await findOneOrFail(query.manager, PermissionOrmEntity, {
          id: permissionId,
        });
      }
    }
    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        // Map to entity
        const entity = this._dataMapper.toEntityForUpdate(query.dto);

        // Set and validate ID
        await entity.initializeUpdateSetId(new UserId(query.id));
        await entity.validateExistingIdForUpdate();

        // Final existence check for ID before update
        await findOneOrFail(query.manager, UserOrmEntity, {
          id: entity.getId().value,
        });

        const result = await this._write.update(
          entity,
          manager,
          query.dto.roleIds,
          query.dto.permissionIds,
        );

        const mergeData = {
          ...query.dto,
          signature: s3ImageResponse ? s3ImageResponse.fileKey : null, // save only the S3 file key here
        };

        if (query.dto.signature) {
          // Map signature data to entity
          const userSignatureEntity = this._dataUserSignatureMapper.toEntity(
            mergeData,
            query.id,
          );

          // Save user signature entity
          await this._writeUserSignature.create(userSignatureEntity, manager);

          if (mockFile) {
            await access(mockFile.path, constants.F_OK);
            await unlink(mockFile.path);
          }
        }

        return result;
      },
    );
  }

  private async checkData(query: UpdateCommand): Promise<void> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
        { property: `${query.id}` },
      );
    }

    await findOneOrFail(query.manager, UserOrmEntity, {
      id: query.id,
    });

    await _checkColumnDuplicate(
      UserOrmEntity,
      'username',
      query.dto.username,
      query.manager,
      'errors.username_already_exists',
      query.id,
    );

    await _checkColumnDuplicate(
      UserOrmEntity,
      'email',
      query.dto.email,
      query.manager,
      'errors.email_already_exists',
      query.id,
    );
    await _checkColumnDuplicate(
      UserOrmEntity,
      'tel',
      query.dto.tel,
      query.manager,
      'errors.tel_already_exists',
      query.id,
    );
  }
}
