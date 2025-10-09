import { HttpStatus, Injectable } from '@nestjs/common';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { DeleteResult, EntityManager } from 'typeorm';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { IWriteExchangeRateRepository } from '@src/modules/manage/domain/ports/output/exchange-rate-repository.interface';
import { ExchangeRateDataAccessMapper } from '../../mappers/exchange-rate.mapper';
import { ExchangeRateEntity } from '@src/modules/manage/domain/entities/exchange-rate.entity';
import { ExchangeRateOrmEntity } from '@src/common/infrastructure/database/typeorm/exchange-rate.orm';
import { ExchangeRateId } from '@src/modules/manage/domain/value-objects/exchange-rate-id.vo';

@Injectable()
export class WriteExchangeRateRepository
  implements IWriteExchangeRateRepository
{
  constructor(
    private readonly _dataAccessMapper: ExchangeRateDataAccessMapper,
  ) {}

  async create(
    entity: ExchangeRateEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<ExchangeRateEntity>> {
    return this._dataAccessMapper.toEntity(
      await manager.save(
        this._dataAccessMapper.toOrmEntity(entity, OrmEntityMethod.CREATE),
      ),
    );
  }

  async update(
    entity: ExchangeRateEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<ExchangeRateEntity>> {
    const OrmEntity = this._dataAccessMapper.toOrmEntity(
      entity,
      OrmEntityMethod.UPDATE,
    );
    try {
      await manager.update(
        ExchangeRateOrmEntity,
        entity.getId().value,
        OrmEntity,
      );

      return this._dataAccessMapper.toEntity(OrmEntity);
    } catch (error) {
      throw error;
    }
  }

  async delete(id: ExchangeRateId, manager: EntityManager): Promise<void> {
    try {
      const deletedUserOrmEntity: DeleteResult = await manager.delete(
        ExchangeRateOrmEntity,
        id.value,
      );
      if (deletedUserOrmEntity.affected === 0) {
        throw new ManageDomainException(
          'errors.not_found',
          HttpStatus.NOT_FOUND,
        );
      }
      return;
    } catch (error) {
      throw error;
    }
  }
}
