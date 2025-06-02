import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { UpdateCommand } from '../update.command';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { DepartmentUserEntity } from '@src/modules/manage/domain/entities/department-user.entity';
import { HttpStatus, Inject } from '@nestjs/common';
import {
  USER_PROFILE_IMAGE_FOLDER,
  WRITE_DEPARTMENT_USER_REPOSITORY,
  WRITE_USER_REPOSITORY,
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

    const optimizedImageProfile = await this._optimizeService.optimizeImage(
      query.dto.signatureFile,
    );

    const s3ImageResponse = await this._amazonS3ServiceKey.uploadFile(
      optimizedImageProfile,
      USER_PROFILE_IMAGE_FOLDER,
    );

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

        // Validate department user exists by user_id
        const existingDeptUser = await findOneOrFail(
          manager,
          DepartmentUserOrmEntity,
          { user_id: updatedUserId },
        );
        // Map to DepartmentUserEntity and set ID
        const departmentUserEntity = this._dataMapper.toEntity(
          query.dto,
          false,
          updatedUserId,
          s3ImageResponse,
        );

        await departmentUserEntity.initializeUpdateSetId(
          new DepartmentUserId(existingDeptUser.id),
        );
        await departmentUserEntity.validateExistingIdForUpdate();
        // Confirm DepartmentUser exists by id before update
        await findOneOrFail(manager, DepartmentUserOrmEntity, {
          id: departmentUserEntity.getId().value,
        });

        // Perform update
        const result = await this._write.update(departmentUserEntity, manager);

        return result;
      },
    );
  }
}
