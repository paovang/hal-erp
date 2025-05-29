import { Injectable } from '@nestjs/common';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CurrencyEntity } from '@src/modules/manage/domain/entities/currency.entity';
import { IWriteCurrencyRepository } from '@src/modules/manage/domain/ports/output/currency-repository.interface';
import { EntityManager, UpdateResult } from 'typeorm';
import { CurrencyDataAccessMapper } from '../../mappers/currency.mapper';
import { CurrencyOrmEntity } from '@src/common/infrastructure/database/typeorm/currency.orm';
import { CurrencyId } from '@src/modules/manage/domain/value-objects/currency-id.vo';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';

@Injectable()
export class WriteCurrencyRepository implements IWriteCurrencyRepository {
  constructor(private readonly _dataAccessMapper: CurrencyDataAccessMapper) {}

  async create(
    entity: CurrencyEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<CurrencyEntity>> {
    return this._dataAccessMapper.toEntity(
      await manager.save(
        this._dataAccessMapper.toOrmEntity(entity, OrmEntityMethod.CREATE),
      ),
    );
  }

  async update(
    entity: CurrencyEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<CurrencyEntity>> {
    const OrmEntity = this._dataAccessMapper.toOrmEntity(
      entity,
      OrmEntityMethod.UPDATE,
    );

    try {
      await manager.update(CurrencyOrmEntity, entity.getId().value, OrmEntity);

      return this._dataAccessMapper.toEntity(OrmEntity);
    } catch (error) {
      throw error;
    }
  }

  async delete(id: CurrencyId, manager: EntityManager): Promise<void> {
    try {
      const deletedUserOrmEntity: UpdateResult = await manager.softDelete(
        CurrencyOrmEntity,
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
