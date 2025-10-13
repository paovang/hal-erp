import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { UpdateCommand } from '../update.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { RoleEntity } from '@src/modules/manage/domain/entities/role.entity';
import { HttpStatus, Inject } from '@nestjs/common';
import {
  GUARD_NAME,
  WRITE_ROLE_GROUP_REPOSITORY,
  WRITE_ROLE_REPOSITORY,
} from '../../../constants/inject-key.const';
import { IWriteRoleRepository } from '@src/modules/manage/domain/ports/output/role-repository.interface';
import { RoleDataMapper } from '../../../mappers/role.mapper';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { RoleOrmEntity } from '@src/common/infrastructure/database/typeorm/role.orm';
import { _checkColumnDuplicate } from '@src/common/utils/check-column-duplicate-orm.util';
import { RoleId } from '@src/modules/manage/domain/value-objects/role-id.vo';
import { PermissionOrmEntity } from '@src/common/infrastructure/database/typeorm/permission.orm';
import { TRANSACTION_MANAGER_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { IWriteRoleGroupRepository } from '@src/modules/manage/domain/ports/output/role-group-repository.interface';
import { RoleGroupDataMapper } from '../../../mappers/role-group.mapper';
import { DepartmentOrmEntity } from '@src/common/infrastructure/database/typeorm/department.orm';
import { RoleGroupOrmEntity } from '@src/common/infrastructure/database/typeorm/role-group.orm';

@CommandHandler(UpdateCommand)
export class UpdateCommandHandler
  implements IQueryHandler<UpdateCommand, ResponseResult<RoleEntity>>
{
  constructor(
    @Inject(WRITE_ROLE_REPOSITORY)
    private readonly _write: IWriteRoleRepository,
    private readonly _dataMapper: RoleDataMapper,
    @Inject(WRITE_ROLE_GROUP_REPOSITORY)
    private readonly _writeRoleGroup: IWriteRoleGroupRepository,
    private readonly _dataRoleGroupMapper: RoleGroupDataMapper,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
  ) {}
  async execute(query: UpdateCommand): Promise<any> {
    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        if (isNaN(query.id)) {
          throw new ManageDomainException(
            'errors.must_be_number',
            HttpStatus.BAD_REQUEST,
            { property: `${query.id}` },
          );
        }

        await findOneOrFail(manager, RoleOrmEntity, {
          id: query.id,
        });

        await _checkColumnDuplicate(
          RoleOrmEntity,
          'name',
          query.dto.name,
          manager,
          'errors.name_already_exists',
          query.id,
        );

        if (query.dto.permissions) {
          for (const id of query.dto.permissions) {
            await findOneOrFail(manager, PermissionOrmEntity, { id: id });
          }
        }

        const entity = this._dataMapper.toEntity(query.dto, GUARD_NAME);

        await entity.initializeUpdateSetId(new RoleId(query.id));
        await entity.validateExistingIdForUpdate();

        await findOneOrFail(manager, RoleOrmEntity, {
          id: entity.getId().value,
        });

        if (query.dto.department_id) {
          await findOneOrFail(manager, RoleGroupOrmEntity, {
            role_id: query.id,
          });
          const department = await findOneOrFail(
            manager,
            DepartmentOrmEntity,
            {
              id: query.dto.department_id,
            },
            `department id ${query.dto.department_id}`,
          );

          await this._writeRoleGroup.deleteByRoleId(
            new RoleId(query.id),
            manager,
          );

          const department_id = department.id;

          const roleGroupEntity = this._dataRoleGroupMapper.toEntity(
            query.id,
            department_id,
          );
          await this._writeRoleGroup.create(roleGroupEntity, manager);
        }

        return this._write.update(entity, manager, query.dto.permissions);
      },
    );
  }
}
