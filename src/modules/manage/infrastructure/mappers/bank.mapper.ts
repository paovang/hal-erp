import { Injectable } from '@nestjs/common';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import moment from 'moment-timezone';
import { BankEntity } from '../../domain/entities/bank.entity';
import { BankOrmEntity } from '@src/common/infrastructure/database/typeorm/bank.orm';
import { BankId } from '../../domain/value-objects/bank-id.vo';

@Injectable()
export class BankDataAccessMapper {
  toOrmEntity(entity: BankEntity, method: OrmEntityMethod): BankOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);
    const id = entity.getId();

    const mediaOrmEntity = new BankOrmEntity();
    if (id) {
      mediaOrmEntity.id = id.value;
    }

    mediaOrmEntity.short_name = entity.short_name;
    mediaOrmEntity.name = entity.name;
    mediaOrmEntity.logo = entity.logo;
    if (method === OrmEntityMethod.CREATE) {
      mediaOrmEntity.created_at = entity.createdAt ?? new Date(now);
    }
    mediaOrmEntity.updated_at = new Date(now);

    return mediaOrmEntity;
  }

  toEntity(ormData: BankOrmEntity): BankEntity {
    const build = BankEntity.builder()
      .setBankId(new BankId(ormData.id))
      .setShortName(ormData.short_name ?? '')
      .setName(ormData.name ?? '')
      .setLogo(ormData.logo ?? 0)
      .setCreatedAt(ormData.created_at)
      .setUpdatedAt(ormData.updated_at);

    return build.build();
  }
}
