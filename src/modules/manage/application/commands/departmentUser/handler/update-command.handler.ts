import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { UpdateCommand } from '../update.command';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { DepartmentUserEntity } from '@src/modules/manage/domain/entities/department-user.entity';
import { HttpStatus, Inject } from '@nestjs/common';
import {
  USER_SIGNATURE_IMAGE_FOLDER,
  WRITE_DEPARTMENT_USER_REPOSITORY,
  WRITE_USER_REPOSITORY,
  WRITE_USER_SIGNATURE_REPOSITORY,
} from '../../../constants/inject-key.const';
import { IWriteDepartmentUserRepository } from '@src/modules/manage/domain/ports/output/department-user-repository.interface';
import { DepartmentUserDataMapper } from '../../../mappers/department-user.mapper';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { DepartmentUserOrmEntity } from '@src/common/infrastructure/database/typeorm/department-user.orm';
import { DepartmentUserId } from '@src/modules/manage/domain/value-objects/department-user-id.vo';
import {
  TRANSACTION_MANAGER_SERVICE,
  USER_PROFILE_IMAGE_FILE_OPTIMIZE_SERVICE_KEY,
} from '@src/common/constants/inject-key.const';
import { ITransactionManagerService } from '@common/infrastructure/transaction/transaction.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PositionOrmEntity } from '@src/common/infrastructure/database/typeorm/position.orm';
import { _checkColumnDuplicate } from '@src/common/utils/check-column-duplicate-orm.util';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorm/user.orm';
import { UserDataMapper } from '../../../mappers/user.mapper';
import { IWriteUserRepository } from '@src/modules/manage/domain/ports/output/user-repository.interface';
import { UserId } from '@src/modules/manage/domain/value-objects/user-id.vo';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { UserContextService } from '@common/infrastructure/cls/cls.service';
import { AMAZON_S3_SERVICE_KEY } from '@src/common/infrastructure/aws3/config/inject-key';
import { IImageOptimizeService } from '@src/common/utils/services/images/interface/image-optimize-service.interface';
import { IAmazonS3ImageService } from '@src/common/infrastructure/aws3/interface/amazon-s3-image-service.interface';
import { DepartmentOrmEntity } from '@src/common/infrastructure/database/typeorm/department.orm';
import { RoleOrmEntity } from '@src/common/infrastructure/database/typeorm/role.orm';
import { PermissionOrmEntity } from '@src/common/infrastructure/database/typeorm/permission.orm';
import { UserSignatureDataMapper } from '../../../mappers/user-signature.mapper';
import { IWriteUserSignatureRepository } from '@src/modules/manage/domain/ports/output/user-signature-repository.interface';
import { UserSignatureId } from '@src/modules/manage/domain/value-objects/user-signature-id.vo';
import { UserSignatureOrmEntity } from '@src/common/infrastructure/database/typeorm/user-signature.orm';

@CommandHandler(UpdateCommand)
export class UpdateCommandHandler
  implements IQueryHandler<UpdateCommand, ResponseResult<DepartmentUserEntity>>
{
  constructor(
    @Inject(WRITE_DEPARTMENT_USER_REPOSITORY)
    private readonly _write: IWriteDepartmentUserRepository,
    private readonly _dataMapper: DepartmentUserDataMapper,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    private readonly _dataUserSignatureMapper: UserSignatureDataMapper,
    @Inject(WRITE_USER_SIGNATURE_REPOSITORY)
    private readonly _writeUserSignature: IWriteUserSignatureRepository,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
    private readonly _dataUserMapper: UserDataMapper,
    @Inject(WRITE_USER_REPOSITORY)
    private readonly _writeUser: IWriteUserRepository,
    private readonly _userContextService: UserContextService,
    @Inject(USER_PROFILE_IMAGE_FILE_OPTIMIZE_SERVICE_KEY)
    private readonly _optimizeService: IImageOptimizeService,
    @Inject(AMAZON_S3_SERVICE_KEY)
    private readonly _amazonS3ServiceKey: IAmazonS3ImageService,
  ) {}

  async execute(query: UpdateCommand): Promise<any> {
    let s3ImageResponse = null;
    await this.checkData(query);
    if (query.dto.signatureFile) {
      const optimizedImageProfile = await this._optimizeService.optimizeImage(
        query.dto.signatureFile,
      );

      s3ImageResponse = await this._amazonS3ServiceKey.uploadFile(
        optimizedImageProfile,
        USER_SIGNATURE_IMAGE_FOLDER,
      );
    }

    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        const userEntity = this._dataUserMapper.toEntityForUpdate(query.dto);

        await userEntity.initializeUpdateSetId(new UserId(query.id));
        await userEntity.validateExistingIdForUpdate();

        const data = await this._writeUser.update(
          userEntity,
          query.manager,
          query.dto.roleIds,
          query.dto.permissionIds,
        );

        const updatedUserId = (data as any)._id._value;

        const existingDeptUser = await findOneOrFail(
          manager,
          DepartmentUserOrmEntity,
          { user_id: updatedUserId },
        );

        const departmentUserEntity = this._dataMapper.toEntity(
          query.dto,
          false,
          updatedUserId,
        );

        await departmentUserEntity.initializeUpdateSetId(
          new DepartmentUserId(existingDeptUser.id),
        );
        await departmentUserEntity.validateExistingIdForUpdate();
        await findOneOrFail(manager, DepartmentUserOrmEntity, {
          id: departmentUserEntity.getId().value,
        });

        const result = await this._write.update(departmentUserEntity, manager);

        const UserSignature = await findOneOrFail(
          manager,
          UserSignatureOrmEntity,
          { user_id: updatedUserId },
        );

        const mergeData = {
          ...query.dto,
          signature: s3ImageResponse?.fileKey ?? null,
        };

        if (query.dto.signatureFile) {
          const userSignatureEntity = this._dataUserSignatureMapper.toEntity(
            mergeData,
            query.id,
          );
          console.log('object 4', userSignatureEntity);
          await userSignatureEntity.initializeUpdateSetId(
            new UserSignatureId(UserSignature.id),
          );
          await userSignatureEntity.validateExistingIdForUpdate();
          await findOneOrFail(manager, UserSignatureOrmEntity, {
            id: userSignatureEntity.getId().value,
          });

          await this._writeUserSignature.update(userSignatureEntity, manager);
        }
        console.log('object 5');

        return result;
      },
    );
  }

  private async checkData(query: UpdateCommand): Promise<void> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
      );
    }

    await findOneOrFail(query.manager, UserOrmEntity, {
      id: query.id,
    });

    await findOneOrFail(query.manager, DepartmentOrmEntity, {
      id: query.dto.departmentId,
    });

    await findOneOrFail(query.manager, PositionOrmEntity, {
      id: query.dto.positionId,
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
  }
}
