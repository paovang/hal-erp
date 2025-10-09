import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CreateUserApprovalDto } from '@src/modules/manage/application/dto/create/userApproval/create.dto';
import { EntityManager } from 'typeorm';
import { UserApprovalEntity } from '../../entities/user-approval.entity';

export interface IUserApprovalServiceInterface {
  //   getAll(
  //     dto: UnitQueryDto,
  //     manager?: EntityManager,
  //   ): Promise<ResponseResult<UserApprovalEntity>>;

  //   getOne(
  //     id: number,
  //     manager?: EntityManager,
  //   ): Promise<ResponseResult<UserApprovalEntity>>;

  create(
    dto: CreateUserApprovalDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<UserApprovalEntity>>;

  //   update(
  //     id: number,
  //     dto: UpdateUnitDto,
  //     manager?: EntityManager,
  //   ): Promise<ResponseResult<UserApprovalEntity>>;

  //   delete(id: number, manager?: EntityManager): Promise<void>;
}
