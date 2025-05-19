import { ResponseResult } from "@src/common/application/interfaces/pagination.interface";
import { EntityManager } from "typeorm";
import { UserEntity } from "../../entities/user.entity";
import { CreateUserDto } from "@src/modules/manage/application/dto/create/user/create.dto";
import { UserQueryDto } from "@src/modules/manage/application/dto/query/user-query.dto";
import { UpdateUserDto } from "@src/modules/manage/application/dto/create/user/update.dto";

export interface IUserServiceInterface {
  getAll(
    dto: UserQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<UserEntity>>;

  getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<UserEntity>>;

  create(
    dto: CreateUserDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<UserEntity>>;

  update(
    id: number,
    dto: UpdateUserDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<UserEntity>>;

  delete(id: number, manager?: EntityManager): Promise<void>;
}