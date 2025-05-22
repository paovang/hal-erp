import { EntityManager } from "typeorm";
import { UnitEntity } from "../../entities/unit.entity";
import { ResponseResult } from "@src/common/application/interfaces/pagination.interface";
import { UnitQueryDto } from "@src/modules/manage/application/dto/query/unit-query.dto";
import { UnitId } from "../../value-objects/unit-id.vo";

export interface IWriteUnitRepository {
  create(
    entity: UnitEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<UnitEntity>>;

  update(
    entity: UnitEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<UnitEntity>>;

  delete(id: UnitId, manager: EntityManager): Promise<void>;
}

export interface IReadUnitRepository {
  findAll(
    query: UnitQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<UnitEntity>>;

  findOne(
    id: UnitId,
    manager: EntityManager,
  ): Promise<ResponseResult<UnitEntity>>;
}