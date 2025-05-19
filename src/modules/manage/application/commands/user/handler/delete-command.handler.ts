import { CommandHandler, IQueryHandler } from "@nestjs/cqrs";
import { DeleteCommand } from "../delete.command";
import { WRITE_USER_REPOSITORY } from "../../../constants/inject-key.const";
import { BadRequestException, Inject } from "@nestjs/common";
import { IWriteUserRepository } from "@src/modules/manage/domain/ports/output/user-repository.interface";
import { findOneOrFail } from "@src/common/utils/fine-one-orm.utils";
import { UserOrmEntity } from "@src/common/infrastructure/database/typeorm/user.orm";
import { UserId } from "@src/modules/manage/domain/value-objects/user-id.vo";

@CommandHandler(DeleteCommand)
export class DeleteCommandHandler
  implements IQueryHandler<DeleteCommand, void>
{
  constructor(
    @Inject(WRITE_USER_REPOSITORY)
    private readonly _write: IWriteUserRepository,
  ) {}

  async execute(query: DeleteCommand): Promise<void> {
    if (isNaN(query.id)) {
        throw new BadRequestException('ID must be a number');
    }

    /** Check Exits Document Type Id */
    await findOneOrFail(query.manager, UserOrmEntity, {
      id: query.id,
    });

    return await this._write.delete(new UserId(query.id), query.manager);
  }
}