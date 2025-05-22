import { CommandHandler, IQueryHandler } from "@nestjs/cqrs";
import { DeleteCommand } from "../delete-command";
import { WRITE_UNIT_REPOSITORY } from "../../../constants/inject-key.const";
import { BadRequestException, Inject } from "@nestjs/common";
import { IWriteUnitRepository } from "@src/modules/manage/domain/ports/output/unit-repository.interface";
import { findOneOrFail } from "@src/common/utils/fine-one-orm.utils";
import { UnitOrmEntity } from "@src/common/infrastructure/database/typeorm/unit.orm";
import { UnitId } from "@src/modules/manage/domain/value-objects/unit-id.vo";

@CommandHandler(DeleteCommand)
export class DeleteCommandHandler
  implements IQueryHandler<DeleteCommand, void>
{
  constructor(
    @Inject(WRITE_UNIT_REPOSITORY)
    private readonly _write: IWriteUnitRepository,
  ) {}

  async execute(query: DeleteCommand): Promise<void> {
    if (isNaN(query.id)) {
        throw new BadRequestException('ID must be a number');
    }

    /** Check Exits Document Type Id */
    await findOneOrFail(query.manager, UnitOrmEntity, {
      id: query.id,
    });

    return await this._write.delete(new UnitId(query.id), query.manager);
  }
}