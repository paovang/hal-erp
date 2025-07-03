import { Injectable } from '@nestjs/common';
import { IWriteUserApprovalRepository } from '@src/modules/manage/domain/ports/output/user-approval-repository.interface';
import { UserApprovalDataAccessMapper } from '../../mappers/user-approval.mapper';
import { UserApprovalEntity } from '@src/modules/manage/domain/entities/user-approval.entity';
import { EntityManager } from 'typeorm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { UserApprovalId } from '@src/modules/manage/domain/value-objects/user-approval-id.vo';
import { UserApprovalOrmEntity } from '@src/common/infrastructure/database/typeorm/user-approval.orm';

@Injectable()
export class WriteUserApprovalRepository
  implements IWriteUserApprovalRepository
{
  constructor(
    private readonly _dataAccessMapper: UserApprovalDataAccessMapper,
  ) {}

  async create(
    entity: UserApprovalEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<UserApprovalEntity>> {
    return this._dataAccessMapper.toEntity(
      await manager.save(
        this._dataAccessMapper.toOrmEntity(entity, OrmEntityMethod.CREATE),
      ),
    );
  }

  async update(
    entity: UserApprovalEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<UserApprovalEntity>> {
    const OrmEntity = this._dataAccessMapper.toOrmEntity(
      entity,
      OrmEntityMethod.UPDATE,
    );

    try {
      await manager.update(
        UserApprovalOrmEntity,
        entity.getId().value,
        OrmEntity,
      );

      return this._dataAccessMapper.toEntity(OrmEntity);
    } catch (error) {
      throw error;
    }
  }

  async delete(id: UserApprovalId, manager: EntityManager): Promise<void> {
    try {
      await manager.softDelete(UserApprovalOrmEntity, id.value);
    } catch (error) {
      throw error;
    }
  }
}
