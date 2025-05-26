import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { PermissionQueryDto } from '@src/modules/manage/application/dto/query/permission-query.dto';
import { EntityManager } from 'typeorm';
import { PermissionGroupEntity } from '../../entities/permission-group.entity';

export interface IPermissionServiceInterface {
  getAll(
    dto: PermissionQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<PermissionGroupEntity>>;

  getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<PermissionGroupEntity>>;

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
