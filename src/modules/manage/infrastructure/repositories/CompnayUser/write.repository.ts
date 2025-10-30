import { Injectable } from '@nestjs/common';
import { IWriteCompanyUserRepository } from '@src/modules/manage/domain/ports/output/company-user-repository.interface';
import { CompanyUserDataAccessMapper } from '../../mappers/company-user.mapper';
import { CompanyUserEntity } from '@src/modules/manage/domain/entities/company-user.entity';
import { EntityManager } from 'typeorm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { CompanyUserId } from '@src/modules/manage/domain/value-objects/company-user-id.vo';
import { CompanyUserOrmEntity } from '@src/common/infrastructure/database/typeorm/company-user.orm';

@Injectable()
export class WriteCompanyUserRepository implements IWriteCompanyUserRepository {
  constructor(
    private readonly _dataAccessMapper: CompanyUserDataAccessMapper,
  ) {}

  async create(
    entity: CompanyUserEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<CompanyUserEntity>> {
    return this._dataAccessMapper.toEntity(
      await manager.save(
        this._dataAccessMapper.toOrmEntity(entity, OrmEntityMethod.CREATE),
      ),
    );
  }

  async delete(id: CompanyUserId, manager: EntityManager): Promise<void> {
    await manager.softDelete(CompanyUserOrmEntity, id.value);
  }
}
