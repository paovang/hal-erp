import { CurrencyOrmEntity } from '@src/common/infrastructure/database/typeorm/currency.orm';
import { CurrencyEntity } from '../../domain/entities/currency.entity';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import moment from 'moment-timezone';
import { CurrencyId } from '../../domain/value-objects/currency-id.vo';

export class CurrencyDataAccessMapper {
  toOrmEntity(categoryEntity: CurrencyEntity): CurrencyOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);
    const id = categoryEntity.getId();

    const mediaOrmEntity = new CurrencyOrmEntity();
    if (id) {
      mediaOrmEntity.id = id.value;
    }
    mediaOrmEntity.name = categoryEntity.name;
    mediaOrmEntity.code = categoryEntity.code;
    mediaOrmEntity.created_at = categoryEntity.createdAt ?? new Date(now);
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
