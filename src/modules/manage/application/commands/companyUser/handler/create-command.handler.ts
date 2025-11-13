import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CompanyUserEntity } from '@src/modules/manage/domain/entities/company-user.entity';
import { CreateCompanyUserCommand } from '../create.command';
import {
  USER_SIGNATURE_IMAGE_FOLDER,
  USER_TYPE_APPLICATION_SERVICE,
  WRITE_COMPANY_USER_REPOSITORY,
  WRITE_USER_REPOSITORY,
  WRITE_USER_SIGNATURE_REPOSITORY,
} from '../../../constants/inject-key.const';
import { Inject } from '@nestjs/common';
import { IWriteUserRepository } from '@src/modules/manage/domain/ports/output/user-repository.interface';
import { UserDataMapper } from '../../../mappers/user.mapper';
import { IWriteUserSignatureRepository } from '@src/modules/manage/domain/ports/output/user-signature-repository.interface';
import { UserSignatureDataMapper } from '../../../mappers/user-signature.mapper';
import { IWriteCompanyUserRepository } from '@src/modules/manage/domain/ports/output/company-user-repository.interface';
import { CompanyUserDataMapper } from '../../../mappers/company-user.mapper';
import {
  TRANSACTION_MANAGER_SERVICE,
  USER_PROFILE_IMAGE_FILE_OPTIMIZE_SERVICE_KEY,
} from '@src/common/constants/inject-key.const';
import { InjectDataSource } from '@nestjs/typeorm';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { DataSource, EntityManager } from 'typeorm';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { RoleOrmEntity } from '@src/common/infrastructure/database/typeorm/role.orm';
import { UserContextService } from '@src/common/infrastructure/cls/cls.service';
import { CompanyUserOrmEntity } from '@src/common/infrastructure/database/typeorm/company-user.orm';
import { _checkColumnDuplicate } from '@src/common/utils/check-column-duplicate-orm.util';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorm/user.orm';
import * as bcrypt from 'bcrypt';
import { PermissionOrmEntity } from '@src/common/infrastructure/database/typeorm/permission.orm';
import { IWriteUserTypeRepository } from '@src/modules/manage/domain/ports/output/user-type-repository.interface';
import { UserTypeDataMapper } from '../../../mappers/user-type.mapper';
import { UserTypeEnum } from '@src/common/constants/user-type.enum';
import path from 'path';
import { createMockMulterFile } from '@src/common/utils/services/file-utils.service';
import { IImageOptimizeService } from '@src/common/utils/services/images/interface/image-optimize-service.interface';
import { IAmazonS3ImageService } from '@src/common/infrastructure/aws3/interface/amazon-s3-image-service.interface';
import { AMAZON_S3_SERVICE_KEY } from '@src/common/infrastructure/aws3/config/inject-key';

@CommandHandler(CreateCompanyUserCommand)
export class CreateCompanyUserCommandHandler
  implements
    IQueryHandler<CreateCompanyUserCommand, ResponseResult<CompanyUserEntity>>
{
  constructor(
    @Inject(WRITE_USER_REPOSITORY)
    private readonly _writeUser: IWriteUserRepository,
    private readonly _dataUserMapper: UserDataMapper,
    @Inject(WRITE_USER_SIGNATURE_REPOSITORY)
    private readonly _writeUserSignature: IWriteUserSignatureRepository,
    private readonly _dataUserSignatureMapper: UserSignatureDataMapper,
    @Inject(WRITE_COMPANY_USER_REPOSITORY)
    private readonly _writeCompanyUser: IWriteCompanyUserRepository,
    private readonly _dataCompanyUserMapper: CompanyUserDataMapper,
    @Inject(USER_TYPE_APPLICATION_SERVICE)
    private readonly _userTypeRepo: IWriteUserTypeRepository,
    private readonly _userTypeDataMapper: UserTypeDataMapper,
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
    command: CreateCompanyUserCommand,
  ): Promise<ResponseResult<CompanyUserEntity>> {
    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        const user = this._userContextService.getAuthUser()?.user;
        const user_id = user.id;

        await this.checkData(command, manager);

        const company_user = await findOneOrFail(
          manager,
          CompanyUserOrmEntity,
          {
            user_id: user_id,
          },
          `company user id ${user_id}`,
        );

        for (const roleId of command.dto.roleIds) {
          await findOneOrFail(
            manager,
            RoleOrmEntity,
            {
              id: roleId,
            },
            `${roleId}`,
          );
        }

        for (const permissionId of command.dto.permissionIds) {
          await findOneOrFail(
            manager,
            PermissionOrmEntity,
            {
              id: permissionId,
            },
            `${permissionId}`,
          );
        }

        const company_id = (company_user as any).company_id;
        const hashedPassword = await bcrypt.hash(command.dto.password, 10);
        const dtoWithHashedPassword = {
          ...command.dto,
          password: hashedPassword,
        };

        const mapUserEntity = await this._dataUserMapper.toEntity(
          dtoWithHashedPassword,
        );

        const companyUser = await this._writeUser.create(
          mapUserEntity,
          manager,
          command.dto.roleIds,
          command.dto.permissionIds,
        );

        const companyUserId = (companyUser as any)._id._value;

        const entity = this._userTypeDataMapper.toEntity(
          {
            name: UserTypeEnum.COMPANY_USER, // Cast to enum
          },
          companyUserId,
        );

        // Save the mapped user types
        await this._userTypeRepo.create(entity, manager);

        // user signature
        let processedItems = null;
        const baseFolder = path.join(
          __dirname,
          '../../../../../../../assets/uploads/',
        );
        let fileKey = null;
        if (command.dto.signature) {
          const mockFile = await createMockMulterFile(
            baseFolder,
            command.dto.signature,
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
          ...command.dto,
          signature: fileKey ?? undefined,
        };

        const mapToEntityUserSignature = this._dataUserSignatureMapper.toEntity(
          processedItems,
          companyUserId,
        );
        await this._writeUserSignature.create(
          mapToEntityUserSignature,
          manager,
        );
        // end

        const mapToEntityCompanyUser = this._dataCompanyUserMapper.toEntity(
          company_id,
          companyUserId,
        );
        return await this._writeCompanyUser.create(
          mapToEntityCompanyUser,
          manager,
        );
      },
    );
  }

  private async checkData(
    query: CreateCompanyUserCommand,
    manager: EntityManager,
  ): Promise<void> {
    await _checkColumnDuplicate(
      UserOrmEntity,
      'username',
      query.dto.username,
      manager,
      'errors.username_already_exists',
    );
    await _checkColumnDuplicate(
      UserOrmEntity,
      'email',
      query.dto.email,
      manager,
      'errors.user_email_already_exists',
    );
    await _checkColumnDuplicate(
      UserOrmEntity,
      'tel',
      query.dto.tel,
      manager,
      'errors.user_tel_already_exists',
    );
  }
}
