import { CreateCommand } from '@src/modules/manage/application/commands/company/create.command';
import { IQueryHandler, CommandHandler } from '@nestjs/cqrs';
import {
  WRITE_COMPANY_REPOSITORY,
  WRITE_COMPANY_USER_REPOSITORY,
  WRITE_USER_REPOSITORY,
  WRITE_USER_SIGNATURE_REPOSITORY,
} from '@src/modules/manage/application/constants/inject-key.const';
import { Inject } from '@nestjs/common';
import { CompanyEntity } from '@src/modules/manage/domain/entities/company.entity';
import { IWriteCompanyRepository } from '@src/modules/manage/domain/ports/output/company-repository.interface';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { CompanyDataMapper } from '@src/modules/manage/application/mappers/company.mapper';
import { TRANSACTION_MANAGER_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransactionManagerService } from '@common/infrastructure/transaction/transaction.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { IWriteCompanyUserRepository } from '@src/modules/manage/domain/ports/output/company-user-repository.interface';
import { CompanyUserDataMapper } from '../../../mappers/company-user.mapper';
import { IWriteUserRepository } from '@src/modules/manage/domain/ports/output/user-repository.interface';
import { UserDataMapper } from '../../../mappers/user.mapper';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorm/user.orm';
import { _checkColumnDuplicate } from '@src/common/utils/check-column-duplicate-orm.util';
import { CompanyOrmEntity } from '@src/common/infrastructure/database/typeorm/company.orm';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { RoleOrmEntity } from '@src/common/infrastructure/database/typeorm/role.orm';
import { IWriteUserSignatureRepository } from '@src/modules/manage/domain/ports/output/user-signature-repository.interface';
import { UserSignatureDataMapper } from '../../../mappers/user-signature.mapper';
import * as bcrypt from 'bcrypt';

@CommandHandler(CreateCommand)
export class CreateCommandHandler
  implements IQueryHandler<CreateCommand, ResponseResult<CompanyEntity>>
{
  constructor(
    @Inject(WRITE_COMPANY_REPOSITORY)
    private readonly _write: IWriteCompanyRepository,
    private readonly _dataMapper: CompanyDataMapper,
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
  ) {}

  async execute(
    command: CreateCommand,
  ): Promise<ResponseResult<CompanyEntity>> {
    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        await this.checkData(command, manager);
        const mapToEntity = await this._dataMapper.toEntity(command.dto);

        const result = await this._write.create(mapToEntity, manager);

        const company_id = (result as any)._id._value;
        const hashedPassword = await bcrypt.hash(command.dto.user.password, 10);
        const dtoWithHashedPassword = {
          ...command.dto.user,
          password: hashedPassword,
        };

        const mapUserEntity = await this._dataUserMapper.toEntityCompany(
          dtoWithHashedPassword,
        );

        const role = await findOneOrFail(
          manager,
          RoleOrmEntity,
          {
            name: 'company-admin',
          },
          `name company-admin`,
        );

        const role_id = (role as any).id;

        const companyUser = await this._writeUser.createWithCompany(
          mapUserEntity,
          manager,
          role_id,
        );

        const companyUserId = (companyUser as any)._id._value;

        const mapToEntityUserSignature = this._dataUserSignatureMapper.toEntity(
          command.dto.user,
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
        await this._writeCompanyUser.create(mapToEntityCompanyUser, manager);

        return result;
      },
    );
  }

  private async checkData(
    query: CreateCommand,
    manager: EntityManager,
  ): Promise<void> {
    await _checkColumnDuplicate(
      CompanyOrmEntity,
      'name',
      query.dto.name,
      manager,
      'errors.name_already_exists',
    );
    await _checkColumnDuplicate(
      CompanyOrmEntity,
      'email',
      query.dto.email,
      manager,
      'errors.email_already_exists',
    );
    await _checkColumnDuplicate(
      CompanyOrmEntity,
      'tel',
      query.dto.tel,
      manager,
      'errors.tel_already_exists',
    );

    await _checkColumnDuplicate(
      UserOrmEntity,
      'username',
      query.dto.user.username,
      manager,
      'errors.username_already_exists',
    );
    await _checkColumnDuplicate(
      UserOrmEntity,
      'email',
      query.dto.user.email,
      manager,
      'errors.user_email_already_exists',
    );
    await _checkColumnDuplicate(
      UserOrmEntity,
      'tel',
      query.dto.user.tel,
      manager,
      'errors.user_tel_already_exists',
    );
  }
}
