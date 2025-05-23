import { CommandHandler, IQueryHandler } from "@nestjs/cqrs";
import { DeleteCommand } from "../delete.command";
import { WRITE_POSITION_REPOSITORY } from "../../../constants/inject-key.const";
import { BadRequestException, Inject } from "@nestjs/common";
import { IWritePositionRepository } from "@src/modules/manage/domain/ports/output/position-repository.interface";
import { findOneOrFail } from "@src/common/utils/fine-one-orm.utils";
import { PositionOrmEntity } from "@src/common/infrastructure/database/typeorm/position.orm";
import { PositionId } from "@src/modules/manage/domain/value-objects/position-id.vo";

@CommandHandler(DeleteCommand)
export class DeleteCommandHandler
  implements IQueryHandler<DeleteCommand, void>
{
  constructor(
    @Inject(WRITE_POSITION_REPOSITORY)
    private readonly _write: IWritePositionRepository,
  ) {}

  async execute(query: DeleteCommand): Promise<void> {
    if (isNaN(query.id)) {
        throw new BadRequestException('ID must be a number');
    }

    /** Check Exits Document Type Id */
    await findOneOrFail(query.manager, PositionOrmEntity, {
      id: query.id,
    });

    return await this._write.delete(new PositionId(query.id), query.manager);
  }
}