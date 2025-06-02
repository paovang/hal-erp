import { Inject } from '@nestjs/common';
import { WRITE_USER_REPOSITORY } from '../../../constants/inject-key.const';
import { CreateCommand } from '../create.command';
import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { UserEntity } from '@src/modules/manage/domain/entities/user.entity';
import { UserDataMapper } from '../../../mappers/user.mapper';
import { IWriteUserRepository } from '@src/modules/manage/domain/ports/output/user-repository.interface';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorm/user.orm';
import { _checkColumnDuplicate } from '@src/common/utils/check-column-duplicate-orm.util';
import { ITransactionManagerService } from '@common/infrastructure/transaction/transaction.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TRANSACTION_MANAGER_SERVICE } from '@src/common/constants/inject-key.const';
import * as bcrypt from 'bcrypt';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { RoleOrmEntity } from '@src/common/infrastructure/database/typeorm/role.orm';
import { PermissionOrmEntity } from '@src/common/infrastructure/database/typeorm/permission.orm';

@CommandHandler(CreateCommand)
export class CreateCommandHandler
  implements IQueryHandler<CreateCommand, ResponseResult<UserEntity>>
{
  constructor(
    @Inject(WRITE_USER_REPOSITORY)
    private readonly _write: IWriteUserRepository,
    private readonly _dataMapper: UserDataMapper,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
  ) {}

  async execute(query: CreateCommand): Promise<ResponseResult<UserEntity>> {
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
    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
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

        const hashedPassword = await bcrypt.hash(query.dto.password, 10);

        const dtoWithHashedPassword = {
          ...query.dto,
          password: hashedPassword,
        };

        const entity = this._dataMapper.toEntity(dtoWithHashedPassword);

        return await this._write.create(
          entity,
          manager,
          query.dto.roleIds,
          query.dto.permissionIds,
        );
      },
    );
  }
}
