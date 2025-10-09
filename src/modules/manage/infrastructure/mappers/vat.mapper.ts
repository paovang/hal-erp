import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import moment from 'moment-timezone';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { VatEntity } from '../../domain/entities/vat.entity';
import { VatId } from '../../domain/value-objects/vat-id.vo';
import { VatOrmEntity } from '@src/common/infrastructure/database/typeorm/vat.orm';

export class VatDataAccessMapper {
  toOrmEntity(entity: VatEntity, method: OrmEntityMethod): VatOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);
    const id = entity.getId();

    const mediaOrmEntity = new VatOrmEntity();
    if (id) {
      mediaOrmEntity.id = id.value;
    }

    mediaOrmEntity.amount = entity.amount;
    if (method === OrmEntityMethod.CREATE) {
      mediaOrmEntity.created_at = entity.createdAt ?? new Date(now);
    }
    mediaOrmEntity.updated_at = new Date(now);

    return mediaOrmEntity;
  }

  toEntity(ormData: VatOrmEntity): VatEntity {
    return VatEntity.builder()
      .setVatId(new VatId(ormData.id))
      .setAmount(ormData.amount)
      .setCreatedAt(ormData.created_at)
      .setUpdatedAt(ormData.updated_at)
      .build();
  }
}
