import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { DeleteCommand } from '../delete.command';
import { HttpStatus, Inject } from '@nestjs/common';
import {
  WRITE_DEPARTMENT_USER_REPOSITORY,
  WRITE_USER_REPOSITORY,
} from '../../../constants/inject-key.const';
import { IWriteDepartmentUserRepository } from '@src/modules/manage/domain/ports/output/department-user-repository.interface';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { DepartmentUserOrmEntity } from '@src/common/infrastructure/database/typeorm/department-user.orm';
import { DepartmentUserId } from '@src/modules/manage/domain/value-objects/department-user-id.vo';
import { TRANSACTION_MANAGER_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransactionManagerService } from '@common/infrastructure/transaction/transaction.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserDataMapper } from '../../../mappers/user.mapper';
import { IWriteUserRepository } from '@src/modules/manage/domain/ports/output/user-repository.interface';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorm/user.orm';
import { UserId } from '@src/modules/manage/domain/value-objects/user-id.vo';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { checkRelationOrThrow } from '@src/common/utils/check-relation-or-throw.util';
import { DocumentOrmEntity } from '@src/common/infrastructure/database/typeorm/document.orm';

@CommandHandler(DeleteCommand)
export class DeleteCommandHandler
  implements IQueryHandler<DeleteCommand, void>
{
  constructor(
    @Inject(WRITE_DEPARTMENT_USER_REPOSITORY)
    private readonly _writeDeptUser: IWriteDepartmentUserRepository,

    @Inject(WRITE_USER_REPOSITORY)
    private readonly _writeUser: IWriteUserRepository,

    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManager: ITransactionManagerService,

    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,

    private readonly _userMapper: UserDataMapper,
  ) {}

  async execute(query: DeleteCommand): Promise<void> {
    const userId = Number(query.id);
    if (isNaN(userId)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
        { property: `${query.id}` },
      );
    }

    // Ensure user exists
    const user = await findOneOrFail(query.manager, UserOrmEntity, {
      id: userId,
    });

    const email = (user as any).email?.value || user.email;
    const tel = (user as any).tel?.value || user.tel;
    const timestamp = Date.now();
    const deletedEmail = `${email}_delete_${timestamp}`;
    const deletedTel = `${tel}_delete_${timestamp}`;

    return await this._transactionManager.runInTransaction(
      this._dataSource,
      async (manager) => {
        // Update email & tel before deletion inside transaction
        const updateEntity = this._userMapper.toEntityForUpdateColumns({
          email: deletedEmail,
          tel: deletedTel,
        });
        updateEntity.setId(new UserId(userId));

        await this._writeUser.updateColumns(updateEntity, manager);

        // Delete user
        await this._writeUser.delete(new UserId(userId), manager);

        // Find and delete department_user by user_id
        const deptUser = await findOneOrFail(manager, DepartmentUserOrmEntity, {
          user_id: userId,
        });

        await checkRelationOrThrow(
          query.manager,
          DocumentOrmEntity,
          { department_id: deptUser.id, requester_id: deptUser.user_id },
          'errors.already_in_use',
          HttpStatus.BAD_REQUEST,
          'document',
        );

        await this._writeDeptUser.delete(
          new DepartmentUserId(deptUser.id),
          manager,
        );
      },
    );
  }
}
