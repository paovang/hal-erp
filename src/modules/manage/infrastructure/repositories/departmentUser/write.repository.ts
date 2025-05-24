import { Injectable } from '@nestjs/common';
import { ResponseResult } from '@src/common/application/interfaces/pagination.interface';
import { DepartmentUserEntity } from '@src/modules/manage/domain/entities/department-user.entity';
import { IWriteDepartmentUserRepository } from '@src/modules/manage/domain/ports/output/department-user-repository.interface';
import { EntityManager, UpdateResult } from 'typeorm';
import { DepartmentUserDataAccessMapper } from '../../mappers/department-user.mapper';
import { DepartmentUserOrmEntity } from '@src/common/infrastructure/database/typeorm/department-user.orm';
import { DepartmentUserId } from '@src/modules/manage/domain/value-objects/department-user-id.vo';

@Injectable()
export class WriteDepartmentUserRepository
  implements IWriteDepartmentUserRepository
{
  constructor(
    private readonly _dataAccessMapper: DepartmentUserDataAccessMapper,
  ) {}

  async create(
    entity: DepartmentUserEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<DepartmentUserEntity>> {
    return this._dataAccessMapper.toEntity(
      await manager.save(this._dataAccessMapper.toOrmEntity(entity)),
    );
  }

  async update(
    entity: DepartmentUserEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<DepartmentUserEntity>> {
    const id = entity.getId().value;
    const ormEntity = this._dataAccessMapper.toOrmEntity(entity);

    try {
      await manager.update(DepartmentUserOrmEntity, id, ormEntity);

      // Re-fetch the updated entity (optional but recommended)
      const updated = await manager.findOneByOrFail(DepartmentUserOrmEntity, {
        id,
      });

      return this._dataAccessMapper.toEntity(updated);
    } catch (error) {
      throw new Error(`Update DepartmentUser failed: ${error.message}`);
    }
  }

  async delete(id: DepartmentUserId, manager: EntityManager): Promise<void> {
    try {
      const deletedUserOrmEntity: UpdateResult = await manager.softDelete(
        DepartmentUserOrmEntity,
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
