import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { UpdateCompanyUserCommand } from '../update.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { HttpStatus, Inject } from '@nestjs/common';
import {
  READ_COMPANY_USER_REPOSITORY,
  WRITE_USER_REPOSITORY,
  WRITE_USER_SIGNATURE_REPOSITORY,
} from '../../../constants/inject-key.const';
import { IWriteUserRepository } from '@src/modules/manage/domain/ports/output/user-repository.interface';
import { UserDataMapper } from '../../../mappers/user.mapper';
import { IWriteUserSignatureRepository } from '@src/modules/manage/domain/ports/output/user-signature-repository.interface';
import { UserSignatureDataMapper } from '../../../mappers/user-signature.mapper';
import { TRANSACTION_MANAGER_SERVICE } from '@src/common/constants/inject-key.const';
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
          await findOneOrFail(manager, RoleOrmEntity, {
            id: roleId,
          });
        }

        for (const permissionId of command.body.permissionIds) {
          await findOneOrFail(manager, PermissionOrmEntity, {
            id: permissionId,
          });
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

        const UserSignature = await findOneOrFail(
          manager,
          UserSignatureOrmEntity,
          { user_id: user_id },
          `user_id ${user_id}`,
        );
        if (command.body.signature) {
          const userSignatureEntity = this._dataUserSignatureMapper.toEntity(
            command.body,
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
