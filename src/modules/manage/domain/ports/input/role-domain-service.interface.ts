import { ResponseResult } from '@src/common/application/interfaces/pagination.interface';
import { RoleQueryDto } from '@src/modules/manage/application/dto/query/role-query.dto';
import { EntityManager } from 'typeorm';
import { RoleEntity } from '../../entities/role.entity';

export interface IRoleServiceInterface {
  getAll(
    dto: RoleQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<RoleEntity>>;

  getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<RoleEntity>>;

  //   create(
  //     dto: CreateUserDto,
  //     manager?: EntityManager,
  //   ): Promise<ResponseResult<UserEntity>>;

  //   update(
  //     id: number,
  //     dto: UpdateUserDto,
  //     manager?: EntityManager,
  //   ): Promise<ResponseResult<UserEntity>>;

  //   delete(id: number, manager?: EntityManager): Promise<void>;
}
