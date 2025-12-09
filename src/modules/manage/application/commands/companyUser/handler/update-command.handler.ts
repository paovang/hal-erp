import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { UpdateCompanyUserCommand } from '../update.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { HttpStatus, Inject } from '@nestjs/common';
import {
  READ_COMPANY_USER_REPOSITORY,
  USER_SIGNATURE_IMAGE_FOLDER,
  WRITE_USER_REPOSITORY,
  WRITE_USER_SIGNATURE_REPOSITORY,
} from '../../../constants/inject-key.const';
import { IWriteUserRepository } from '@src/modules/manage/domain/ports/output/user-repository.interface';
import { UserDataMapper } from '../../../mappers/user.mapper';
import { IWriteUserSignatureRepository } from '@src/modules/manage/domain/ports/output/user-signature-repository.interface';
import { UserSignatureDataMapper } from '../../../mappers/user-signature.mapper';
import {
  TRANSACTION_MANAGER_SERVICE,
  USER_PROFILE_IMAGE_FILE_OPTIMIZE_SERVICE_KEY,
} from '@src/common/constants/inject-key.const';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { UserContextService } from '@src/common/infrastructure/cls/cls.service';
import { DataSource } from 'typeorm';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { CompanyUserOrmEntity } from '@src/common/infrastructure/database/typeorm/company-user.orm';
import { RoleOrmEntity } from '@src/common/infrastructure/database/typeorm/role.orm';
import { PermissionOrmEntity } from '@src/common/infrastructure/database/typeorm/permission.orm';
import { UserId } from '@src/modules/manage/domain/value-objects/user-id.vo';
import { UserSignatureOrmEntity } from '@src/common/infrastructure/database/typeorm/user-signature.orm';
import { UserSignatureId } from '@src/modules/manage/domain/value-objects/user-signature-id.vo';
import { _checkColumnDuplicate } from '@src/common/utils/check-column-duplicate-orm.util';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorm/user.orm';
import { CompanyUserEntity } from '@src/modules/manage/domain/entities/company-user.entity';
import { CompanyUserId } from '@src/modules/manage/domain/value-objects/company-user-id.vo';
import { IReadCompanyUserRepository } from '@src/modules/manage/domain/ports/output/company-user-repository.interface';
import { createMockMulterFile } from '@src/common/utils/services/file-utils.service';
import path from 'path';
import { IImageOptimizeService } from '@src/common/utils/services/images/interface/image-optimize-service.interface';
import { IAmazonS3ImageService } from '@src/common/infrastructure/aws3/interface/amazon-s3-image-service.interface';
import { AMAZON_S3_SERVICE_KEY } from '@src/common/infrastructure/aws3/config/inject-key';

@CommandHandler(UpdateCompanyUserCommand)
export class UpdateCompanyUserCommandHandler
  implements
    IQueryHandler<UpdateCompanyUserCommand, ResponseResult<CompanyUserEntity>>
{
  constructor(
    @Inject(WRITE_USER_REPOSITORY)
    private readonly _writeUser: IWriteUserRepository,
    private readonly _dataUserMapper: UserDataMapper,
    @Inject(READ_COMPANY_USER_REPOSITORY)
    private readonly _readCompanyUser: IReadCompanyUserRepository,
    @Inject(WRITE_USER_SIGNATURE_REPOSITORY)
    private readonly _writeUserSignature: IWriteUserSignatureRepository,
    private readonly _dataUserSignatureMapper: UserSignatureDataMapper,
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
    command: UpdateCompanyUserCommand,
  ): Promise<ResponseResult<CompanyUserEntity>> {
    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        if (isNaN(command.id)) {
          throw new ManageDomainException(
            'errors.must_be_number',
            HttpStatus.BAD_REQUEST,
            { property: `${command.id}` },
          );
        }

        const company_user = await findOneOrFail(
          manager,
          CompanyUserOrmEntity,
          {
            id: command.id,
          },
          `${command.id}}`,
        );

        const user_id = company_user.user_id;

        if (!user_id)
          throw new ManageDomainException(
            'errors.not_found',
            HttpStatus.NOT_FOUND,
            {
              property: 'user',
            },
          );

        await _checkColumnDuplicate(
          UserOrmEntity,
          'username',
          command.body.username,
          manager,
          'errors.username_already_exists',
          user_id,
        );

        await _checkColumnDuplicate(
          UserOrmEntity,
          'email',
          command.body.email,
          manager,
          'errors.email_already_exists',
          user_id,
        );

        await _checkColumnDuplicate(
          UserOrmEntity,
          'tel',
          command.body.tel,
          manager,
          'errors.tel_already_exists',
          user_id,
        );

        for (const roleId of command.body.roleIds) {
          await findOneOrFail(
            manager,
            RoleOrmEntity,
            {
              id: roleId,
            },
            `${roleId}`,
          );
        }

        if (command.body.permissionIds.length > 0) {
          for (const permissionId of command.body.permissionIds) {
            await findOneOrFail(
              manager,
              PermissionOrmEntity,
              {
                id: permissionId,
              },
              `${permissionId}`,
            );
          }
        }

        const userEntity = this._dataUserMapper.toEntityForUpdate(command.body);

        await userEntity.initializeUpdateSetId(new UserId(user_id));
        await userEntity.validateExistingIdForUpdate();

        await this._writeUser.update(
          userEntity,
          manager,
          command.body.roleIds,
          command.body.permissionIds,
        );

        if (command.body.signature) {
          const UserSignature = await findOneOrFail(
            manager,
            UserSignatureOrmEntity,
            { user_id: user_id },
            `user_id ${user_id}`,
          );
          // user signature
          let processedItems = null;
          const baseFolder = path.join(
            __dirname,
            '../../../../../../../assets/uploads/',
          );
          let fileKey = null;
          if (command.body.signature) {
            const mockFile = await createMockMulterFile(
              baseFolder,
              command.body.signature,
            );
            const optimizedImage =
              await this._optimizeService.optimizeImage(mockFile);
            const s3ImageResponse = await this._amazonS3ServiceKey.uploadFile(
              optimizedImage,
              USER_SIGNATURE_IMAGE_FOLDER,
            );
            fileKey = s3ImageResponse.fileKey;
          }

          processedItems = {
            ...command.body,
            signature: fileKey ?? undefined,
          };
          const userSignatureEntity = this._dataUserSignatureMapper.toEntity(
            processedItems,
            user_id,
          );
          await userSignatureEntity.initializeUpdateSetId(
            new UserSignatureId(UserSignature.id),
          );
          await userSignatureEntity.validateExistingIdForUpdate();
          await findOneOrFail(manager, UserSignatureOrmEntity, {
            id: userSignatureEntity.getId().value,
          });

          await this._writeUserSignature.update(userSignatureEntity, manager);
        }

        const company_user_id = new CompanyUserId(command.id);

        return await this._readCompanyUser.findOne(company_user_id, manager);
      },
    );
  }
}
