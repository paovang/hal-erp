import { UnitOrmEntity } from "@src/common/infrastructure/database/typeorm/unit.orm";
import { UnitEntity } from "../../domain/entities/unit.entity";
import { DateFormat } from "@src/common/domain/value-objects/date-format.vo";
import { Timezone } from "@src/common/domain/value-objects/timezone.vo";
import moment from 'moment-timezone';
import { UnitId } from "../../domain/value-objects/unit-id.vo";

export class UnitDataAccessMapper {
  toOrmEntity(unitEntity: UnitEntity): UnitOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);
    const id = unitEntity.getId();

    const mediaOrmEntity = new UnitOrmEntity();
    if (id) {
      mediaOrmEntity.id = id.value;
    }

    mediaOrmEntity.name = unitEntity.name;
    mediaOrmEntity.created_at = unitEntity.createdAt ?? new Date(now);
    mediaOrmEntity.updated_at = new Date(now);

    return mediaOrmEntity;
  }

  toEntity(ormData: UnitOrmEntity): UnitEntity {
    return UnitEntity.builder()
      .setUnitId(new UnitId(ormData.id))
      .setName(ormData.name)
      .setCreatedAt(ormData.created_at)
      .setUpdatedAt(ormData.updated_at)
      .build();
  }
}