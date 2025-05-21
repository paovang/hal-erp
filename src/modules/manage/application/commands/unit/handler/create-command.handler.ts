import { CommandHandler, IQueryHandler } from "@nestjs/cqrs";
import { CreateCommand } from "../create.command";
import { ResponseResult } from "@src/common/application/interfaces/pagination.interface";
import { UnitEntity } from "@src/modules/manage/domain/entities/unit.entity";
import { WRITE_UNIT_REPOSITORY } from "../../../constants/inject-key.const";
import { Inject } from "@nestjs/common";
import { UnitDataMapper } from "../../../mappers/unit.mapper";
import { IWriteUnitRepository } from "@src/modules/manage/domain/ports/output/unit-repository.interface";
import { UnitOrmEntity } from "@src/common/infrastructure/database/typeorm/unit.orm";
import { _checkColumnDuplicate } from "@src/common/utils/check-column-duplicate-orm.util";

@CommandHandler(CreateCommand)
export class CreateCommandHandler
  implements IQueryHandler<CreateCommand, ResponseResult<UnitEntity>>
{
  constructor(
    @Inject(WRITE_UNIT_REPOSITORY)
    private readonly _write: IWriteUnitRepository,
    private readonly _dataMapper: UnitDataMapper,
  ) {}

  async execute(
    query: CreateCommand,
  ): Promise<ResponseResult<UnitEntity>> {

    await _checkColumnDuplicate(UnitOrmEntity, 'name', query.dto.name, query.manager, 'Name already exists');

    const entity = this._dataMapper.toEntity(query.dto);

    return await this._write.create(entity, query.manager);
  }
}