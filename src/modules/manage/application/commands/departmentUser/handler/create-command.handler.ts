import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { CreateCommand } from '../create.command';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { DepartmentUserEntity } from '@src/modules/manage/domain/entities/department-user.entity';
import {
  USER_PROFILE_IMAGE_FOLDER,
  WRITE_DEPARTMENT_USER_REPOSITORY,
  WRITE_USER_REPOSITORY,
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

@CommandHandler(CreateCommand)
export class CreateCommandHandler
  implements IQueryHandler<CreateCommand, ResponseResult<DepartmentUserEntity>>
{
  constructor(
    @Inject(WRITE_DEPARTMENT_USER_REPOSITORY)
    private readonly _write: IWriteDepartmentUserRepository,
    private readonly _dataMapper: DepartmentUserDataMapper,
    private readonly _dataUserMapper: UserDataMapper,
    @Inject(WRITE_USER_REPOSITORY)
    private readonly _writeUser: IWriteUserRepository,
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
    query: CreateCommand,
  ): Promise<ResponseResult<DepartmentUserEntity>> {
    const optimizedImageProfile = await this._optimizeService.optimizeImage(
      query.dto.signatureFile,
    );

    const s3ImageResponse = await this._amazonS3ServiceKey.uploadFile(
      optimizedImageProfile,
      USER_PROFILE_IMAGE_FOLDER,
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

    await this.checkData(query);

    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        const hashedPassword = await bcrypt.hash(query.dto.password, 10);

        const dtoWithHashedPassword = {
          ...query.dto,
          password: hashedPassword,
          signature: query.dto.signatureFile,
        };
        // Step 1: Save the user entity
        const userEntity = this._dataUserMapper.toEntity(dtoWithHashedPassword);
        const data = await this._writeUser.create(
          userEntity,
          query.manager,
          query.dto.roleIds,
          query.dto.permissionIds,
        );

        const id = (data as any)._id._value;

        // Step 4: Map and save the department-user entity
        const departmentUserEntity = this._dataMapper.toEntity(
          query.dto,
          true,
          id,
          s3ImageResponse,
        );
        // departmentUserEntity.signature_file = s3ImageResponse.fileKey;
        const result = await this._write.create(departmentUserEntity, manager);
        return result;
      },
    );
  }

  private async checkData(query: CreateCommand): Promise<void> {
    await findOneOrFail(query.manager, PositionOrmEntity, {
      id: Number(query.dto.positionId),
    });

    await findOneOrFail(query.manager, DepartmentOrmEntity, {
      id: Number(query.dto.departmentId),
    });

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
