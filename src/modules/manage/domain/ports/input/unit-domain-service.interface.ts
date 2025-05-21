import { ResponseResult } from "@src/common/application/interfaces/pagination.interface";
import { CreateUnitDto } from "@src/modules/manage/application/dto/create/unit/create.dto";
import { EntityManager } from "typeorm";
import { UnitEntity } from "../../entities/unit.entity";

export interface IUnitServiceInterface {
//   getAll(
//     dto: UserQueryDto,
//     manager?: EntityManager,
//   ): Promise<ResponseResult<UserEntity>>;

//   getOne(
//     id: number,
//     manager?: EntityManager,
//   ): Promise<ResponseResult<UserEntity>>;

  create(
    dto: CreateUnitDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<UnitEntity>>;

//   update(
//     id: number,
//     dto: UpdateUserDto,
//     manager?: EntityManager,
//   ): Promise<ResponseResult<UserEntity>>;

//   delete(id: number, manager?: EntityManager): Promise<void>;
}