import { ResponseResult } from "@src/common/application/interfaces/pagination.interface";
import { CreateUnitDto } from "@src/modules/manage/application/dto/create/unit/create.dto";
import { EntityManager } from "typeorm";
import { UnitEntity } from "../../entities/unit.entity";
import { UnitQueryDto } from "@src/modules/manage/application/dto/query/unit-query.dto";
import { UpdateUnitDto } from "@src/modules/manage/application/dto/create/unit/update.dto";

export interface IUnitServiceInterface {
  getAll(
    dto: UnitQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<UnitEntity>>;

  getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<UnitEntity>>;

  create(
    dto: CreateUnitDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<UnitEntity>>;

  update(
    id: number,
    dto: UpdateUnitDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<UnitEntity>>;

  delete(id: number, manager?: EntityManager): Promise<void>;
}