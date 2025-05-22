import { EntityManager } from "typeorm";
import { DepartmentUserEntity } from "../../entities/department-user.entity";
import { ResponseResult } from "@src/common/application/interfaces/pagination.interface";
import { UserEntity } from "../../entities/user.entity";


// export interface IReadDepartmentRepository {
//   findAll(
//     query: DepartmentQueryDto,
//     manager: EntityManager,
//   ): Promise<ResponseResult<DepartmentEntity>>;


//   findOne(
//     id: DepartmentId,
//     manager: EntityManager,
//   ): Promise<ResponseResult<DepartmentEntity>>;
// }

export interface IWriteDepartmentUserRepository {
  create(
    entity: DepartmentUserEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<DepartmentUserEntity>>;

//   update(
//     entity: DepartmentEntity,
//     manager: EntityManager,
//   ): Promise<ResponseResult<DepartmentEntity>>;

//   delete(id: DepartmentId, manager: EntityManager): Promise<void>;
}