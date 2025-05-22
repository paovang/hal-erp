import { CommandHandler, IQueryHandler } from "@nestjs/cqrs";
import { UpdateCommand } from "../update.command";
import { ResponseResult } from "@src/common/application/interfaces/pagination.interface";
import { UnitEntity } from "@src/modules/manage/domain/entities/unit.entity";
import { WRITE_UNIT_REPOSITORY } from "../../../constants/inject-key.const";
import { BadRequestException, Inject } from "@nestjs/common";
import { IWriteUnitRepository } from "@src/modules/manage/domain/ports/output/unit-repository.interface";
import { UnitDataMapper } from "../../../mappers/unit.mapper";
import { findOneOrFail } from "@src/common/utils/fine-one-orm.utils";
import { UnitOrmEntity } from "@src/common/infrastructure/database/typeorm/unit.orm";
import { _checkColumnDuplicate } from "@src/common/utils/check-column-duplicate-orm.util";
import { UnitId } from "@src/modules/manage/domain/value-objects/unit-id.vo";

@CommandHandler(UpdateCommand)
export class UpdateCommandHandler
  implements IQueryHandler<UpdateCommand, ResponseResult<UnitEntity>>
{
  constructor(
    @Inject(WRITE_UNIT_REPOSITORY)
    private readonly _write: IWriteUnitRepository,
    private readonly _dataMapper: UnitDataMapper,
  ) {}
    async execute(query: UpdateCommand): Promise<any> {
        if (isNaN(query.id)) {
            throw new BadRequestException('ID must be a number');
        }

        await findOneOrFail(query.manager, UnitOrmEntity, {
            id: query.id,
        });

        await _checkColumnDuplicate(UnitOrmEntity, 'name', query.dto.name, query.manager, 'Name already exists', query.id);

        // Map to entity
        const entity = this._dataMapper.toEntity(query.dto);

        // Set and validate ID
        await entity.initializeUpdateSetId(new UnitId(query.id));
        await entity.validateExistingIdForUpdate();

        // Final existence check for ID before update
        await findOneOrFail(query.manager, UnitOrmEntity, {
            id: entity.getId().value,
        });

        return this._write.update(entity, query.manager);
    }
}