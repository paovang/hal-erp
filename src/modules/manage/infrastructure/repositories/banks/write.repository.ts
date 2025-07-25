import { Injectable } from '@nestjs/common';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { EntityManager, UpdateResult } from 'typeorm';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { BankOrmEntity } from '@src/common/infrastructure/database/typeorm/bank.orm';
import { BankId } from '@src/modules/manage/domain/value-objects/bank-id.vo';
import { BankEntity } from '@src/modules/manage/domain/entities/bank.entity';
import { IWriteBankRepository } from '@src/modules/manage/domain/ports/output/bank-repository.interace';
import { BankDataAccessMapper } from '../../mappers/bank.mapper';

@Injectable()
export class WriteBankRepository implements IWriteBankRepository {
  constructor(private readonly _dataAccessMapper: BankDataAccessMapper) {}

  async create(
    entity: BankEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<BankEntity>> {
    return this._dataAccessMapper.toEntity(
      await manager.save(
        this._dataAccessMapper.toOrmEntity(entity, OrmEntityMethod.CREATE),
      ),
    );
  }

  async update(
    entity: BankEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<BankEntity>> {
    const OrmEntity = this._dataAccessMapper.toOrmEntity(
      entity,
      OrmEntityMethod.UPDATE,
    );

    try {
      await manager.update(BankOrmEntity, entity.getId().value, OrmEntity);

      return this._dataAccessMapper.toEntity(OrmEntity);
    } catch (error) {
      throw error;
    }
  }

  async delete(id: BankId, manager: EntityManager): Promise<void> {
    try {
      const deletedUserOrmEntity: UpdateResult = await manager.softDelete(
        BankOrmEntity,
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
