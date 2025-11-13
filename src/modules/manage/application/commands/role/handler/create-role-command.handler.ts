import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { RoleEntity } from '@src/modules/manage/domain/entities/role.entity';
import { Inject } from '@nestjs/common';
import {
  GUARD_NAME,
  WRITE_ROLE_REPOSITORY,
} from '../../../constants/inject-key.const';
import { RoleOrmEntity } from '@src/common/infrastructure/database/typeorm/role.orm';
import { IWriteRoleRepository } from '@src/modules/manage/domain/ports/output/role-repository.interface';
import { TRANSACTION_MANAGER_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { RoleDataMapper } from '../../../mappers/role.mapper';
import { CreateRoleCommand } from '../create-role.command';
import { _checkColumnDuplicate } from '@src/common/utils/check-column-duplicate-orm.util';

@CommandHandler(CreateRoleCommand)
export class CreateRoleCommandHandler
  implements IQueryHandler<CreateRoleCommand, ResponseResult<RoleEntity>>
{
  constructor(
    @Inject(WRITE_ROLE_REPOSITORY)
    private readonly _write: IWriteRoleRepository,
    private readonly _dataMapper: RoleDataMapper,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
  ) {}

  async execute(query: CreateRoleCommand): Promise<ResponseResult<RoleEntity>> {
    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        const creteEntity = this._dataMapper.toEntityRole(
          query.dto,
          GUARD_NAME,
        );

        await _checkColumnDuplicate(
          RoleOrmEntity,
          'name',
          query.dto.name,
          manager,
          'errors.name_already_exists',
        );

        return await this._write.create(creteEntity, manager);
      },
    );
  }
}
