import { Injectable } from '@nestjs/common';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { DepartmentApproverEntity } from '@src/modules/manage/domain/entities/department-approver.entity';
import { IWriteDepartmentApproverRepository } from '@src/modules/manage/domain/ports/output/department-approver-repositiory.interface';
import { EntityManager, UpdateResult } from 'typeorm';
import { DepartmentApproverDataAccessMapper } from '../../mappers/department-approver.mapper';
import { DepartmentApproverOrmEntity } from '@src/common/infrastructure/database/typeorm/department-approver.orm';
import { DepartmentApproverId } from '@src/modules/manage/domain/value-objects/department-approver-id.vo';

@Injectable()
export class WriteDepartmentApproverRepository
  implements IWriteDepartmentApproverRepository
{
  constructor(
    private readonly _dataAccessMapper: DepartmentApproverDataAccessMapper,
  ) {}

  async create(
    entity: DepartmentApproverEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<DepartmentApproverEntity>> {
    return this._dataAccessMapper.toEntity(
      await manager.save(this._dataAccessMapper.toOrmEntity(entity)),
    );
  }

  async update(
    entity: DepartmentApproverEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<DepartmentApproverEntity>> {
    const userOrmEntity = this._dataAccessMapper.toOrmEntity(entity);

    try {
      await manager.update(
        DepartmentApproverOrmEntity,
        entity.getId().value,
        userOrmEntity,
      );

      return this._dataAccessMapper.toEntity(userOrmEntity);
    } catch (error) {
      throw error;
    }
  }

  async delete(
    id: DepartmentApproverId,
    manager: EntityManager,
  ): Promise<void> {
    try {
      const deletedUserOrmEntity: UpdateResult = await manager.softDelete(
        DepartmentApproverOrmEntity,
        id.value,
      );
      if (deletedUserOrmEntity.affected === 0) {
        // throw new UserDomainException('users.not_found', HttpStatus.NOT_FOUND);
      }
      return;
    } catch (error) {
      throw error;
    }
  }
}
