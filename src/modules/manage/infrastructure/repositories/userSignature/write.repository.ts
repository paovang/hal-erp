import { Injectable } from '@nestjs/common';
import { IWriteUserSignatureRepository } from '@src/modules/manage/domain/ports/output/user-signature-repository.interface';
import { UserSignatureDataAccessMapper } from '../../mappers/user-signature.mapper';
import { UserSignatureEntity } from '@src/modules/manage/domain/entities/user-signature.entity';
import { EntityManager } from 'typeorm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { UserSignatureOrmEntity } from '@src/common/infrastructure/database/typeorm/user-signature.orm';

@Injectable()
export class WriteUserSignatureRepository
  implements IWriteUserSignatureRepository
{
  constructor(
    private readonly _dataAccessMapper: UserSignatureDataAccessMapper,
  ) {}

  async create(
    entity: UserSignatureEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<UserSignatureEntity>> {
    return this._dataAccessMapper.toEntity(
      await manager.save(
        this._dataAccessMapper.toOrmEntity(entity, OrmEntityMethod.CREATE),
      ),
    );
  }

  async update(
    entity: UserSignatureEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<UserSignatureEntity>> {
    const OrmEntity = this._dataAccessMapper.toOrmEntity(
      entity,
      OrmEntityMethod.UPDATE,
    );

    try {
      await manager.update(
        UserSignatureOrmEntity,
        entity.getId().value,
        OrmEntity,
      );

      return this._dataAccessMapper.toEntity(OrmEntity);
    } catch (error) {
      throw error;
    }
  }
}
