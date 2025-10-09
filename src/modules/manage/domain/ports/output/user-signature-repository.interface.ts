import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { EntityManager } from 'typeorm';
import { UserSignatureEntity } from '../../entities/user-signature.entity';

export interface IWriteUserSignatureRepository {
  create(
    entity: UserSignatureEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<UserSignatureEntity>>;

  update(
    entity: UserSignatureEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<UserSignatureEntity>>;

  //   delete(id: UserId, manager: EntityManager): Promise<void>;
}
