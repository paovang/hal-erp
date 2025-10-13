import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { CreateCommand } from '../create.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { RoleEntity } from '@src/modules/manage/domain/entities/role.entity';
import { Inject } from '@nestjs/common';
import {
  GUARD_NAME,
  WRITE_ROLE_GROUP_REPOSITORY,
  WRITE_ROLE_PERMISSION_REPOSITORY,
  WRITE_ROLE_REPOSITORY,
} from '../../../constants/inject-key.const';
import { RoleOrmEntity } from '@src/common/infrastructure/database/typeorm/role.orm';
import { _checkColumnDuplicate } from '@src/common/utils/check-column-duplicate-orm.util';
import { RoleDataMapper } from '../../../mappers/role.mapper';
import { IWriteRoleRepository } from '@src/modules/manage/domain/ports/output/role-repository.interface';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { TRANSACTION_MANAGER_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PermissionOrmEntity } from '@src/common/infrastructure/database/typeorm/permission.orm';
import { IWriteRolePermissionRepository } from '@src/modules/manage/domain/ports/output/role-permission-repository.interface';
import { IWriteRoleGroupRepository } from '@src/modules/manage/domain/ports/output/role-group-repository.interface';
import { RoleGroupDataMapper } from '../../../mappers/role-group.mapper';
import { RolePermissionDataMapper } from '../../../mappers/role-permission.mapper';
import { DepartmentOrmEntity } from '@src/common/infrastructure/database/typeorm/department.orm';

@CommandHandler(CreateCommand)
export class CreateCommandHandler
  implements IQueryHandler<CreateCommand, ResponseResult<RoleEntity>>
{
  constructor(
    @Inject(WRITE_ROLE_REPOSITORY)
    private readonly _write: IWriteRoleRepository,
    private readonly _dataMapper: RoleDataMapper,
    @Inject(WRITE_ROLE_GROUP_REPOSITORY)
    private readonly _writeRoleGroup: IWriteRoleGroupRepository,
    private readonly _dataRoleGroupMapper: RoleGroupDataMapper,
    @Inject(WRITE_ROLE_PERMISSION_REPOSITORY)
    private readonly _writeRolePermission: IWriteRolePermissionRepository,
    private readonly _dataRolePermissionMapper: RolePermissionDataMapper,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
  ) {}

  async execute(query: CreateCommand): Promise<ResponseResult<RoleEntity>> {
    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        await _checkColumnDuplicate(
          RoleOrmEntity,
          'name',
          query.dto.name,
          manager,
          'errors.name_already_exists',
        );

        if (query.dto.department_id) {
          await findOneOrFail(
            manager,
            DepartmentOrmEntity,
            {
              id: query.dto.department_id,
            },
            `department id ${query.dto.department_id}`,
          );
        }

        if (query.dto.permissions) {
          for (const permission_id of query.dto.permissions) {
            await findOneOrFail(manager, PermissionOrmEntity, {
              id: permission_id,
            });
          }
        }

        const entity = this._dataMapper.toEntity(query.dto, GUARD_NAME);

        const result = await this._write.create(
          entity,
          manager,
          query.dto.permissions,
        );

        const role_id = (result as any)._id._value;

        if (query.dto.department_id) {
          const roleGroupEntity = this._dataRoleGroupMapper.toEntity(
            role_id,
            query.dto.department_id,
          );

          await this._writeRoleGroup.create(roleGroupEntity, manager);
        }

        return result;
      },
    );
  }
}
