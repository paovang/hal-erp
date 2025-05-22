import { CommandHandler, IQueryHandler } from "@nestjs/cqrs";
import { CreateCommand } from "../create.command";
import { ResponseResult } from "@src/common/application/interfaces/pagination.interface";
import { DepartmentUserEntity } from "@src/modules/manage/domain/entities/department-user.entity";
import { Inject } from "@nestjs/common";
import { WRITE_DEPARTMENT_USER_REPOSITORY, WRITE_USER_REPOSITORY } from "../../../constants/inject-key.const";
import { DepartmentUserDataMapper } from "../../../mappers/department-user.mapper";
import { IWriteDepartmentUserRepository } from "@src/modules/manage/domain/ports/output/department-user-repository.interface";
import { UserDataMapper } from "../../../mappers/user.mapper";
import { IWriteUserRepository } from "@src/modules/manage/domain/ports/output/user-repository.interface";
import { TransactionManagerService } from "@src/common/infrastructure/transaction/transaction.service";

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
  ) {}

  async execute(
    query: CreateCommand,
  ): Promise<ResponseResult<DepartmentUserEntity>> {
    // Step 1: Save the user entity
    const userEntity = this._dataUserMapper.toEntity(query.dto);
    const data = await this._writeUser.create(userEntity, query.manager);

    const id = (data as any)._id._value;

    // Step 4: Map and save the department-user entity
    const departmentUserEntity = this._dataMapper.toEntity(query.dto, id);
    return await this._write.create(departmentUserEntity, query.manager);
  }
}