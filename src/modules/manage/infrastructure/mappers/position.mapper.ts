import { PositionOrmEntity } from "@src/common/infrastructure/database/typeorm/position.orm";
import { PositionEntity } from "../../domain/entities/position.entity";
import { Timezone } from "@src/common/domain/value-objects/timezone.vo";
import { DateFormat } from "@src/common/domain/value-objects/date-format.vo";
import moment from 'moment-timezone';
import { PositionId } from "../../domain/value-objects/position-id.vo";

export class PositionDataAccessMapper {
  toOrmEntity(positionEntity: PositionEntity): PositionOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);
    const id = positionEntity.getId();

    const mediaOrmEntity = new PositionOrmEntity();
    if (id) {
      mediaOrmEntity.id = id.value;
    }

    mediaOrmEntity.name = positionEntity.name;
    mediaOrmEntity.created_at = positionEntity.createdAt ?? new Date(now);
    mediaOrmEntity.updated_at = new Date(now);

    return mediaOrmEntity;
  }

  toEntity(ormData: PositionOrmEntity): PositionEntity {
    return PositionEntity.builder()
      .setPositionId(new PositionId(ormData.id))
      .setName(ormData.name ?? '')
      .setCreatedAt(ormData.created_at)
      .setUpdatedAt(ormData.updated_at)
      .build();
  }
}