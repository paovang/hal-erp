import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { UpdateCommand } from '../update.command';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { DepartmentUserEntity } from '@src/modules/manage/domain/entities/department-user.entity';
import { BadRequestException, HttpStatus, Inject } from '@nestjs/common';
import {
  WRITE_DEPARTMENT_USER_REPOSITORY,
  WRITE_USER_REPOSITORY,
} from '../../../constants/inject-key.const';
import { IWriteDepartmentUserRepository } from '@src/modules/manage/domain/ports/output/department-user-repository.interface';
import { DepartmentUserDataMapper } from '../../../mappers/department-user.mapper';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { DepartmentUserOrmEntity } from '@src/common/infrastructure/database/typeorm/department-user.orm';
import { DepartmentUserId } from '@src/modules/manage/domain/value-objects/department-user-id.vo';
import { TRANSACTION_MANAGER_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransactionManagerService } from '@common/infrastructure/transaction/transaction.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PositionOrmEntity } from '@src/common/infrastructure/database/typeorm/position.orm';
import { _checkColumnDuplicate } from '@src/common/utils/check-column-duplicate-orm.util';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorm/user.orm';
import { UserDataMapper } from '../../../mappers/user.mapper';
import { IWriteUserRepository } from '@src/modules/manage/domain/ports/output/user-repository.interface';
import { UserId } from '@src/modules/manage/domain/value-objects/user-id.vo';
import path from 'path';
import * as fs from 'fs';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';

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
  ) {}

  private deleteFileIfExists(filename: string, file_path: string): void {
    if (!filename) return;

    const filePath = path.join(__dirname, file_path, filename);

    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (!err) {
          console.log('File deleted:', filePath);
        }
      });
    }
  }

  private moveFileIfExists(filename: string, from: string, to: string): void {
    if (!filename) return;

    const fromPath = path.join(__dirname, from, filename);
    const toPath = path.join(__dirname, to, filename);

    // Ensure the destination folder exists
    const destinationDir = path.dirname(toPath);
    if (!fs.existsSync(destinationDir)) {
      fs.mkdirSync(destinationDir, { recursive: true });
    }

    if (fs.existsSync(fromPath)) {
      fs.rename(fromPath, toPath, (err) => {
        if (!err) {
          console.log('File moved:', filename);
        }
      });
    } else {
      throw new BadRequestException('File not found');
    }
  }

  async execute(query: UpdateCommand): Promise<any> {
    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        if (isNaN(query.id)) {
          throw new ManageDomainException(
            'errors.must_be_number',
            HttpStatus.BAD_REQUEST,
          );
        }

        await findOneOrFail(query.manager, UserOrmEntity, {
          id: query.id,
        });

        await findOneOrFail(query.manager, PositionOrmEntity, {
          id: query.dto.positionId,
        });

        await findOneOrFail(query.manager, PositionOrmEntity, {
          id: query.dto.departmentId,
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
        const userEntity = this._dataUserMapper.toEntityForUpdate(query.dto);

        await userEntity.initializeUpdateSetId(new UserId(query.id));
        await userEntity.validateExistingIdForUpdate();

        const data = await this._writeUser.update(userEntity, query.manager);

        const updatedUserId = (data as any)._id._value;

        // Validate department user exists by user_id
        const existingDeptUser = await findOneOrFail(
          manager,
          DepartmentUserOrmEntity,
          { user_id: updatedUserId },
        );

        const file = (existingDeptUser as any).signature_file;

        // Delete old signature file
        this.deleteFileIfExists(file, '../../../../../../../assets/files/');

        // Map to DepartmentUserEntity and set ID
        const departmentUserEntity = this._dataMapper.toEntity(
          query.dto,
          false,
          updatedUserId,
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

        this.moveFileIfExists(
          query.dto.signature_file,
          '../../../../../../../assets/uploads/',
          '../../../../../../../assets/files/',
        );

        this.deleteFileIfExists(
          query.dto.signature_file,
          '../../../../../../../assets/uploads/',
        );

        return result;
      },
    );
  }
}
