import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { Injectable } from '@nestjs/common';
import { ExchangeRateId } from '../../domain/value-objects/exchange-rate-id.vo';
import { UserTypeEntity } from '../../domain/entities/user-type.entity';
import { UserTypeOrmEntity } from '@src/common/infrastructure/database/typeorm/user-type.orm';

@Injectable()
export class UserTypeDataAccessMapper {
  // constructor(private readonly _userMapper: UserDataAccessMapper) {}

  toOrmEntity(
    userTypeEntity: UserTypeEntity,
    method: OrmEntityMethod,
  ): UserTypeOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);
    const id = userTypeEntity.getId();
    const userTypeOrm = new UserTypeOrmEntity();

    if (id) {
      userTypeOrm.id = Number(id.value);
    }

    userTypeOrm.name = userTypeEntity.name;
    userTypeOrm.user_id = userTypeEntity.user_id;

    if (method === OrmEntityMethod.CREATE) {
      userTypeOrm.created_at = userTypeEntity.createdAt ?? new Date(now);
    }
    userTypeOrm.updated_at = new Date(now);

    return userTypeOrm;
  }

  toEntity(ormData: UserTypeOrmEntity): UserTypeEntity {
    const build = UserTypeEntity.builder()
      .setUserTypeId(new ExchangeRateId(ormData.id))
      .setName(ormData.name ?? '')
      .setUserId(ormData.user_id ?? 0)
      .setCreatedAt(ormData.created_at)
      .setUpdatedAt(ormData.updated_at);
    return build.build();
  }

  toEntities(ormDataArray: UserTypeOrmEntity[]): UserTypeEntity[] {
    return ormDataArray.map((ormData) => this.toEntity(ormData));
  }
}
