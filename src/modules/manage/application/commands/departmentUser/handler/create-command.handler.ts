import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { CreateCommand } from '../create.command';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { DepartmentUserEntity } from '@src/modules/manage/domain/entities/department-user.entity';
import { Inject } from '@nestjs/common';
import {
  WRITE_DEPARTMENT_USER_REPOSITORY,
  WRITE_USER_REPOSITORY,
} from '../../../constants/inject-key.const';
import { DepartmentUserDataMapper } from '../../../mappers/department-user.mapper';
import { IWriteDepartmentUserRepository } from '@src/modules/manage/domain/ports/output/department-user-repository.interface';
import { UserDataMapper } from '../../../mappers/user.mapper';
import { IWriteUserRepository } from '@src/modules/manage/domain/ports/output/user-repository.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { ITransactionManagerService } from '@common/infrastructure/transaction/transaction.interface';
import { DataSource } from 'typeorm';
import { TRANSACTION_MANAGER_SERVICE } from '@src/common/constants/inject-key.const';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { PositionOrmEntity } from '@src/common/infrastructure/database/typeorm/position.orm';
import { _checkColumnDuplicate } from '@src/common/utils/check-column-duplicate-orm.util';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorm/user.orm';
import * as bcrypt from 'bcrypt';

@CommandHandler(CreateCommand)
export class CreateCommandHandler
  implements IQueryHandler<CreateCommand, ResponseResult<DepartmentUserEntity>>
{
  constructor(
    @Inject(WRITE_DEPARTMENT_USER_REPOSITORY)
    private readonly _write: IWriteDepartmentUserRepository,
    private readonly _dataMapper: DepartmentUserDataMapper,
    private readonly _dataUserMapper: UserDataMapper,
    @Inject(WRITE_USER_REPOSITORY)
    private readonly _writeUser: IWriteUserRepository,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
  ) {}

  async execute(
    query: CreateCommand,
  ): Promise<ResponseResult<DepartmentUserEntity>> {
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
      'Email already exists',
    );

    await _checkColumnDuplicate(
      UserOrmEntity,
      'tel',
      query.dto.tel,
      query.manager,
      'Tel already exists',
    );

    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        const hashedPassword = await bcrypt.hash(query.dto.password, 10);

        const dtoWithHashedPassword = {
          ...query.dto,
          password: hashedPassword,
        };
        // Step 1: Save the user entity
        const userEntity = this._dataUserMapper.toEntity(dtoWithHashedPassword);
        const data = await this._writeUser.create(userEntity, query.manager);

        const id = (data as any)._id._value;

        // Step 4: Map and save the department-user entity
        const departmentUserEntity = this._dataMapper.toEntity(
          query.dto,
          true,
          id,
        );
        return await this._write.create(departmentUserEntity, manager);
      },
    );
  }
}
