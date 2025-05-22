import { Injectable } from "@nestjs/common";
import { ResponseResult } from "@src/common/application/interfaces/pagination.interface";
import { PositionEntity } from "@src/modules/manage/domain/entities/position.entity";
import { IWritePositionRepository } from "@src/modules/manage/domain/ports/output/position-repository.interface";
import { EntityManager } from "typeorm";
import { PositionDataAccessMapper } from "../../mappers/position.mapper";

@Injectable()
export class WritePositionRepository implements IWritePositionRepository {
  constructor(private readonly _dataAccessMapper: PositionDataAccessMapper) {}

  async create(
    entity: PositionEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<PositionEntity>> {
    return this._dataAccessMapper.toEntity(
      await manager.save(this._dataAccessMapper.toOrmEntity(entity)),
    );
  }

}