import { Inject } from '@nestjs/common';
import {
  USER_SIGNATURE_IMAGE_FOLDER,
  WRITE_USER_REPOSITORY,
  WRITE_USER_SIGNATURE_REPOSITORY,
} from '../../../constants/inject-key.const';
import { CreateCommand } from '../create.command';
import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { UserEntity } from '@src/modules/manage/domain/entities/user.entity';
import { UserDataMapper } from '../../../mappers/user.mapper';
import { IWriteUserRepository } from '@src/modules/manage/domain/ports/output/user-repository.interface';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorm/user.orm';
import { _checkColumnDuplicate } from '@src/common/utils/check-column-duplicate-orm.util';
import { ITransactionManagerService } from '@common/infrastructure/transaction/transaction.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
  TRANSACTION_MANAGER_SERVICE,
  USER_PROFILE_IMAGE_FILE_OPTIMIZE_SERVICE_KEY,
} from '@src/common/constants/inject-key.const';
import * as bcrypt from 'bcrypt';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { RoleOrmEntity } from '@src/common/infrastructure/database/typeorm/role.orm';
import { PermissionOrmEntity } from '@src/common/infrastructure/database/typeorm/permission.orm';
import { IWriteUserSignatureRepository } from '@src/modules/manage/domain/ports/output/user-signature-repository.interface';
import { UserSignatureDataMapper } from '../../../mappers/user-signature.mapper';
import { IImageOptimizeService } from '@src/common/utils/services/images/interface/image-optimize-service.interface';
import { AMAZON_S3_SERVICE_KEY } from '@src/common/infrastructure/aws3/config/inject-key';
import { IAmazonS3ImageService } from '@src/common/infrastructure/aws3/interface/amazon-s3-image-service.interface';
import * as path from 'path';
import { createMockMulterFile } from '@src/common/utils/services/file-utils.service';
import { access, unlink } from 'fs/promises';
import { constants } from 'fs';

@CommandHandler(CreateCommand)
export class CreateCommandHandler
  implements IQueryHandler<CreateCommand, ResponseResult<UserEntity>>
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

  async execute(query: CreateCommand): Promise<ResponseResult<UserEntity>> {
    let s3ImageResponse = null;
    let mockFile = null;
    await this.checkData(query);

    const baseFolder = path.join(
      __dirname,
      '../../../../../../../assets/uploads/',
    );

    if (query.dto.signature) {
      mockFile = await createMockMulterFile(baseFolder, query.dto.signature);

      const optimizedImage =
        await this._optimizeService.optimizeImage(mockFile);

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

    for (const permissionId of query.dto.permissionIds) {
      await findOneOrFail(query.manager, PermissionOrmEntity, {
        id: permissionId,
      });
    }

    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        const hashedPassword = await bcrypt.hash(query.dto.password, 10);

        const dtoWithHashedPassword = {
          ...query.dto,
          password: hashedPassword,
        };

        const entity = this._dataMapper.toEntity(dtoWithHashedPassword);

        const user = await this._write.create(
          entity,
          manager,
          query.dto.roleIds,
          query.dto.permissionIds,
        );

        const user_id = (user as any)._id._value;

        const mergeData = {
          ...query.dto,
          signature: s3ImageResponse ? s3ImageResponse.fileKey : null,
        };

        if (query.dto.signature) {
          const userSignatureEntity = this._dataUserSignatureMapper.toEntity(
            mergeData,
            user_id,
          );

          await this._writeUserSignature.create(userSignatureEntity, manager);
          if (mockFile) {
            await access(mockFile.path, constants.F_OK);
            await unlink(mockFile.path);
          }
        }

        return user;
      },
    );
  }

  private async checkData(query: CreateCommand): Promise<void> {
    await _checkColumnDuplicate(
      UserOrmEntity,
      'username',
      query.dto.username,
      query.manager,
      'errors.username_already_exists',
    );
    await _checkColumnDuplicate(
      UserOrmEntity,
      'email',
      query.dto.email,
      query.manager,
      'errors.email_already_exists',
    );
    await _checkColumnDuplicate(
      UserOrmEntity,
      'tel',
      query.dto.tel,
      query.manager,
      'errors.tel_already_exists',
    );
  }
}
