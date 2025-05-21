import { CommandHandler, IQueryHandler } from "@nestjs/cqrs";
import { WRITE_USER_REPOSITORY } from "../../../constants/inject-key.const";
import { BadRequestException, Inject } from "@nestjs/common";
import { ResponseResult } from "@src/common/application/interfaces/pagination.interface";
import { UpdateCommand } from "../update-command";
import { UserEntity } from "@src/modules/manage/domain/entities/user.entity";
import { IWriteUserRepository } from "@src/modules/manage/domain/ports/output/user-repository.interface";
import { UserDataMapper } from "../../../mappers/user.mapper";
import { findOneOrFail } from "@src/common/utils/fine-one-orm.utils";
import { UserOrmEntity } from "@src/common/infrastructure/database/typeorm/user.orm";
import { UserId } from "@src/modules/manage/domain/value-objects/user-id.vo";
import { _checkColumnDuplicate } from "@src/common/utils/check-column-duplicate-orm.util";

@CommandHandler(UpdateCommand)
export class UpdateCommandHandler
  implements IQueryHandler<UpdateCommand, ResponseResult<UserEntity>>
{
  constructor(
    @Inject(WRITE_USER_REPOSITORY)
    private readonly _write: IWriteUserRepository,
    private readonly _dataMapper: UserDataMapper,
  ) {}
    async execute(query: UpdateCommand): Promise<any> {
        if (isNaN(query.id)) {
            throw new BadRequestException('ID must be a number');
        }

        await findOneOrFail(query.manager, UserOrmEntity, {
            id: query.id,
        });

        await _checkColumnDuplicate(UserOrmEntity, 'email', query.dto.email, query.manager, 'Email already exists', query.id);
        await _checkColumnDuplicate(UserOrmEntity, 'tel', query.dto.tel, query.manager, 'Tel already exists', query.id);

        // Map to entity
        const entity = this._dataMapper.toEntityForUpdate(query.dto);

        // Set and validate ID
        await entity.initializeUpdateSetId(new UserId(query.id));
        await entity.validateExistingIdForUpdate();

        // Final existence check for ID before update
        await findOneOrFail(query.manager, UserOrmEntity, {
            id: entity.getId().value,
        });

        return this._write.update(entity, query.manager);
    }
}