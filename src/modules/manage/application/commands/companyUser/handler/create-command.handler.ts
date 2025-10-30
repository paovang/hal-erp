import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CompanyUserEntity } from '@src/modules/manage/domain/entities/company-user.entity';
import { CreateCompanyUserCommand } from '../create.command';
import {
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
import { TRANSACTION_MANAGER_SERVICE } from '@src/common/constants/inject-key.const';
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
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
    private readonly _userContextService: UserContextService,
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

        const company_id = (company_user as any).company_id;
        const hashedPassword = await bcrypt.hash(command.dto.password, 10);
        const dtoWithHashedPassword = {
          ...command.dto,
          password: hashedPassword,
        };

        const mapUserEntity = await this._dataUserMapper.toEntityCompany(
          dtoWithHashedPassword,
        );

        const role = await findOneOrFail(
          manager,
          RoleOrmEntity,
          {
            name: 'company-user',
          },
          `role company-user`,
        );

        const role_id = (role as any).id;

        const companyUser = await this._writeUser.createWithCompany(
          mapUserEntity,
          manager,
          role_id,
        );

        const companyUserId = (companyUser as any)._id._value;

        const mapToEntityUserSignature = this._dataUserSignatureMapper.toEntity(
          command.dto,
          companyUserId,
        );
        await this._writeUserSignature.create(
          mapToEntityUserSignature,
          manager,
        );

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
