import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { CreateCommand } from '../create.command';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { DepartmentUserEntity } from '@src/modules/manage/domain/entities/department-user.entity';
import {
  USER_SIGNATURE_IMAGE_FOLDER,
  USER_TYPE_APPLICATION_SERVICE,
  WRITE_DEPARTMENT_USER_REPOSITORY,
  WRITE_USER_REPOSITORY,
  WRITE_USER_SIGNATURE_REPOSITORY,
} from '../../../constants/inject-key.const';
import { DepartmentUserDataMapper } from '../../../mappers/department-user.mapper';
import { IWriteDepartmentUserRepository } from '@src/modules/manage/domain/ports/output/department-user-repository.interface';
import { UserDataMapper } from '../../../mappers/user.mapper';
import { IWriteUserRepository } from '@src/modules/manage/domain/ports/output/user-repository.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { ITransactionManagerService } from '@common/infrastructure/transaction/transaction.interface';
import { DataSource } from 'typeorm';
import {
  TRANSACTION_MANAGER_SERVICE,
  USER_PROFILE_IMAGE_FILE_OPTIMIZE_SERVICE_KEY,
} from '@src/common/constants/inject-key.const';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { PositionOrmEntity } from '@src/common/infrastructure/database/typeorm/position.orm';
import { _checkColumnDuplicate } from '@src/common/utils/check-column-duplicate-orm.util';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorm/user.orm';
import * as bcrypt from 'bcrypt';
import { DepartmentOrmEntity } from '@src/common/infrastructure/database/typeorm/department.orm';
import { UserContextService } from '@src/common/infrastructure/cls/cls.service';
import { Inject } from '@nestjs/common';
import { IImageOptimizeService } from '@src/common/utils/services/images/interface/image-optimize-service.interface';
import { AMAZON_S3_SERVICE_KEY } from '@src/common/infrastructure/aws3/config/inject-key';
import { IAmazonS3ImageService } from '@src/common/infrastructure/aws3/interface/amazon-s3-image-service.interface';
import { RoleOrmEntity } from '@src/common/infrastructure/database/typeorm/role.orm';
import { PermissionOrmEntity } from '@src/common/infrastructure/database/typeorm/permission.orm';
import { UserSignatureDataMapper } from '../../../mappers/user-signature.mapper';
import { IWriteUserSignatureRepository } from '@src/modules/manage/domain/ports/output/user-signature-repository.interface';
import { UserTypeDataMapper } from '../../../mappers/user-type.mapper';
import { UserTypeEnum } from '@src/common/constants/user-type.enum';
import { IWriteUserTypeRepository } from '@src/modules/manage/domain/ports/output/user-type-repository.interface';

@CommandHandler(CreateCommand)
export class CreateCommandHandler
  implements IQueryHandler<CreateCommand, ResponseResult<DepartmentUserEntity>>
{
  constructor(
    @Inject(WRITE_DEPARTMENT_USER_REPOSITORY)
    private readonly _write: IWriteDepartmentUserRepository,
    private readonly _dataMapper: DepartmentUserDataMapper,
    private readonly _userTypeDataMapper: UserTypeDataMapper,
    private readonly _dataUserMapper: UserDataMapper,
    @Inject(WRITE_USER_REPOSITORY)
    private readonly _writeUser: IWriteUserRepository,
    private readonly _dataUserSignatureMapper: UserSignatureDataMapper,
    @Inject(WRITE_USER_SIGNATURE_REPOSITORY)
    private readonly _writeUserSignature: IWriteUserSignatureRepository,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
    private readonly _userContextService: UserContextService,
    @Inject(USER_TYPE_APPLICATION_SERVICE)
    private readonly _userTypeRepo: IWriteUserTypeRepository,
    @Inject(USER_PROFILE_IMAGE_FILE_OPTIMIZE_SERVICE_KEY)
    private readonly _optimizeService: IImageOptimizeService,
    @Inject(AMAZON_S3_SERVICE_KEY)
    private readonly _amazonS3ServiceKey: IAmazonS3ImageService,
  ) {}

  async execute(
    query: CreateCommand,
  ): Promise<ResponseResult<DepartmentUserEntity>> {
    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        const optimizedImageProfile = await this._optimizeService.optimizeImage(
          query.dto.signatureFile,
        );

        const s3ImageResponse = await this._amazonS3ServiceKey.uploadFile(
          optimizedImageProfile,
          USER_SIGNATURE_IMAGE_FOLDER,
        );

        for (const roleId of query.dto.roleIds) {
          await findOneOrFail(manager, RoleOrmEntity, {
            id: roleId,
          });
        }

        for (const permissionId of query.dto.permissionIds) {
          await findOneOrFail(manager, PermissionOrmEntity, {
            id: permissionId,
          });
        }

        await this.checkData(query);

        const hashedPassword = await bcrypt.hash(query.dto.password, 10);
        const dtoWithHashedPassword = {
          ...query.dto,
          password: hashedPassword,
        };
        // Step 1: Save the user entity
        const userEntity = this._dataUserMapper.toEntity(dtoWithHashedPassword);
        const data = await this._writeUser.create(
          userEntity,
          manager,
          query.dto.roleIds,
          query.dto.permissionIds,
        );

        const id = (data as any)._id._value;

        const mergeData = {
          ...query.dto,
          signature: s3ImageResponse.fileKey,
        };

        if (query.dto.signatureFile) {
          const userSignatureEntity = this._dataUserSignatureMapper.toEntity(
            mergeData,
            id,
          );

          await this._writeUserSignature.create(userSignatureEntity, manager);
        }

        // Step 4: Map and save the department-user entity
        const departmentUserEntity = this._dataMapper.toEntity(
          query.dto,
          true,
          id,
        );
        // departmentUserEntity.signature_file = s3ImageResponse.fileKey;
        const result = await this._write.create(departmentUserEntity, manager);
        const user_id = (result as any)._userID;

        const mergeUserType = query.dto.user_type.map((userType) => ({
          name: userType,
        }));
        const usertTypeEntities = [];
        for (const userTypeDto of mergeUserType) {
          const entity = this._userTypeDataMapper.toEntity(
            {
              name: userTypeDto.name as UserTypeEnum, // Cast to enum
            },
            user_id,
          );
          usertTypeEntities.push(entity);
        }
        // Save the mapped user types
        await this._userTypeRepo.create(usertTypeEntities, manager);
        return result;
      },
    );
  }

  private async checkData(query: CreateCommand): Promise<void> {
    await findOneOrFail(
      query.manager,
      PositionOrmEntity,
      {
        id: Number(query.dto.positionId),
      },
      `${query.dto.positionId}`,
    );

    await findOneOrFail(
      query.manager,
      DepartmentOrmEntity,
      {
        id: Number(query.dto.departmentId),
      },
      `${query.dto.departmentId}`,
    );

    if (query.dto.line_manager_id) {
      await findOneOrFail(
        query.manager,
        UserOrmEntity,
        {
          id: Number(query.dto.line_manager_id),
        },
        `${query.dto.line_manager_id}`,
      );
    }

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
