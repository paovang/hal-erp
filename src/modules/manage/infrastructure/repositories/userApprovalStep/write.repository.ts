import { Injectable } from '@nestjs/common';
import { IWriteUserApprovalStepRepository } from '@src/modules/manage/domain/ports/output/user-approval-step-repository.interface';
import { UserApprovalStepDataAccessMapper } from '../../mappers/user-approval-step.mapper';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { UserApprovalStepEntity } from '@src/modules/manage/domain/entities/user-approval-step.entity';
import { EntityManager } from 'typeorm';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { UserApprovalStepOrmEntity } from '@src/common/infrastructure/database/typeorm/user-approval-step.orm';
import { UserApprovalStepId } from '@src/modules/manage/domain/value-objects/user-approval-step-id.vo';

@Injectable()
export class WriteUserApprovalStepRepository
  implements IWriteUserApprovalStepRepository
{
  constructor(
    private readonly _dataAccessMapper: UserApprovalStepDataAccessMapper,
  ) {}
  async update(
    entity: UserApprovalStepEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<UserApprovalStepEntity>> {
    const OrmEntity = this._dataAccessMapper.toOrmEntity(
      entity,
      OrmEntityMethod.UPDATE,
    );

    try {
      await manager.update(
        UserApprovalStepOrmEntity,
        entity.getId().value,
        OrmEntity,
      );

      return this._dataAccessMapper.toEntity(OrmEntity);
    } catch (error) {
      throw error;
    }
  }

  async create(
    entity: UserApprovalStepEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<UserApprovalStepEntity>> {
    return this._dataAccessMapper.toEntity(
      await manager.save(
        this._dataAccessMapper.toOrmEntity(entity, OrmEntityMethod.CREATE),
      ),
    );
  }

  async delete(id: UserApprovalStepId, manager: EntityManager): Promise<void> {
    try {
      await manager.softDelete(UserApprovalStepOrmEntity, id.value);
    } catch (error) {
      throw error;
    }
  }
}
