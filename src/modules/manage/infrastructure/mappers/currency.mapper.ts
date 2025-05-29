import { CurrencyOrmEntity } from '@src/common/infrastructure/database/typeorm/currency.orm';
import { CurrencyEntity } from '../../domain/entities/currency.entity';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import moment from 'moment-timezone';
import { CurrencyId } from '../../domain/value-objects/currency-id.vo';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';

export class CurrencyDataAccessMapper {
  toOrmEntity(
    currencyEntity: CurrencyEntity,
    method: OrmEntityMethod,
  ): CurrencyOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);
    const id = currencyEntity.getId();

    const mediaOrmEntity = new CurrencyOrmEntity();
    if (id) {
      mediaOrmEntity.id = id.value;
    }
    mediaOrmEntity.name = currencyEntity.name;
    mediaOrmEntity.code = currencyEntity.code;
    if (method === OrmEntityMethod.CREATE) {
      mediaOrmEntity.created_at = currencyEntity.createdAt ?? new Date(now);
    }
    mediaOrmEntity.updated_at = new Date(now);

    return mediaOrmEntity;
  }

  toEntity(ormData: CurrencyOrmEntity): CurrencyEntity {
    return CurrencyEntity.builder()
      .setCurrencyId(new CurrencyId(ormData.id))
      .setCode(ormData.code)
      .setName(ormData.name ?? '')
      .setCreatedAt(ormData.created_at)
      .setUpdatedAt(ormData.updated_at)
      .build();
  }
}
