import { PositionOrmEntity } from '@src/common/infrastructure/database/typeorm/position.orm';
import { PositionEntity } from '../../domain/entities/position.entity';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import moment from 'moment-timezone';
import { PositionId } from '../../domain/value-objects/position-id.vo';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { Injectable } from '@nestjs/common';
import { CompanyDataAccessMapper } from './company.mapper';

@Injectable()
export class PositionDataAccessMapper {
  constructor(
    private readonly _companyDataAccessMapper: CompanyDataAccessMapper,
  ) {}
  toOrmEntity(
    positionEntity: PositionEntity,
    method: OrmEntityMethod,
  ): PositionOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);
    const id = positionEntity.getId();

    const mediaOrmEntity = new PositionOrmEntity();
    if (id) {
      mediaOrmEntity.id = id.value;
    }

    mediaOrmEntity.name = positionEntity.name;
    mediaOrmEntity.company_id = positionEntity.company_id;
    if (method === OrmEntityMethod.CREATE) {
      mediaOrmEntity.created_at = positionEntity.createdAt ?? new Date(now);
    }
    mediaOrmEntity.updated_at = new Date(now);

    return mediaOrmEntity;
  }

  toEntity(ormData: PositionOrmEntity): PositionEntity {
    const entity = PositionEntity.builder()
      .setPositionId(new PositionId(ormData.id))
      .setName(ormData.name ?? '')
      .setCompanyId(ormData.company_id ?? 0)
      .setCreatedAt(ormData.created_at)
      .setUpdatedAt(ormData.updated_at);

    if (ormData.company) {
      entity.setCompany(
        this._companyDataAccessMapper.toEntity(ormData.company),
      );
    }

    return entity.build();
  }
}
