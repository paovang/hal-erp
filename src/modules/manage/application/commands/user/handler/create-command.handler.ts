import { Inject } from "@nestjs/common";
import { WRITE_USER_REPOSITORY } from "../../../constants/inject-key.const";
import { CreateCommand } from "../create.command";
import { CommandHandler, IQueryHandler } from "@nestjs/cqrs";
import { ResponseResult } from "@src/common/application/interfaces/pagination.interface";
import { UserEntity } from "@src/modules/manage/domain/entities/user.entity";
import { UserDataMapper } from "../../../mappers/user.mapper";
import { IWriteUserRepository } from "@src/modules/manage/domain/ports/output/user-repository.interface";
import { UserOrmEntity } from "@src/common/infrastructure/database/typeorm/user.orm";
import { _checkColumnDuplicate } from "@src/common/utils/check-column-duplicate-orm.util";

@CommandHandler(CreateCommand)
export class CreateCommandHandler
  implements IQueryHandler<CreateCommand, ResponseResult<UserEntity>>
{
  constructor(
    @Inject(WRITE_USER_REPOSITORY)
    private readonly _write: IWriteUserRepository,
    private readonly _dataMapper: UserDataMapper,
  ) {}

  async execute(
    query: CreateCommand,
  ): Promise<ResponseResult<UserEntity>> {

    await _checkColumnDuplicate(UserOrmEntity, 'email', query.dto.email, query.manager, 'Email already exists');
    await _checkColumnDuplicate(UserOrmEntity, 'tel', query.dto.tel, query.manager, 'Tel already exists');

    const entity = this._dataMapper.toEntity(query.dto);

    return await this._write.create(entity, query.manager);
  }
}