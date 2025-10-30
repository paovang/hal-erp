import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { DeleteCompanyUserCommand } from '../delete.command';
import {
  WRITE_COMPANY_USER_REPOSITORY,
  WRITE_USER_REPOSITORY,
} from '../../../constants/inject-key.const';
import { HttpStatus, Inject } from '@nestjs/common';
import { IWriteUserRepository } from '@src/modules/manage/domain/ports/output/user-repository.interface';
import { UserDataMapper } from '../../../mappers/user.mapper';
import { IWriteCompanyUserRepository } from '@src/modules/manage/domain/ports/output/company-user-repository.interface';
import { TRANSACTION_MANAGER_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserContextService } from '@src/common/infrastructure/cls/cls.service';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { CompanyUserOrmEntity } from '@src/common/infrastructure/database/typeorm/company-user.orm';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorm/user.orm';
import { UserId } from '@src/modules/manage/domain/value-objects/user-id.vo';
import { CompanyUserDataMapper } from '../../../mappers/company-user.mapper';
import { CompanyUserId } from '@src/modules/manage/domain/value-objects/company-user-id.vo';

@CommandHandler(DeleteCompanyUserCommand)
export class DeleteCompanyUserCommandHandler
  implements IQueryHandler<DeleteCompanyUserCommand, void>
{
  constructor(
    @Inject(WRITE_USER_REPOSITORY)
    private readonly _writeUser: IWriteUserRepository,
    private readonly _dataUserMapper: UserDataMapper,
    @Inject(WRITE_COMPANY_USER_REPOSITORY)
    private readonly _writeCompanyUser: IWriteCompanyUserRepository,
    private readonly _dataCompanyMapper: CompanyUserDataMapper,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
    private readonly _userContextService: UserContextService,
  ) {}

  async execute(command: DeleteCompanyUserCommand): Promise<void> {
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
          `${command.id}`,
        );

        const user_id = company_user.user_id;

        if (!user_id)
          throw new ManageDomainException(
            'errors.not_found',
            HttpStatus.NOT_FOUND,
            { property: `${user_id}` },
          );

        const check_user = await findOneOrFail(
          manager,
          UserOrmEntity,
          {
            id: user_id,
          },
          `${user_id}`,
        );

        if (!check_user) {
          throw new ManageDomainException(
            'errors.not_found',
            HttpStatus.NOT_FOUND,
            { property: `${check_user}` },
          );
        }

        const id = new UserId(user_id);
        await this._writeUser.delete(id, manager);

        const company_user_id = new CompanyUserId(command.id);

        await this._writeCompanyUser.delete(company_user_id, manager);
      },
    );
  }
}
