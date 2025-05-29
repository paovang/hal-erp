import { RoleOrmEntity } from '@src/common/infrastructure/database/typeorm/role.orm';
import { RoleEntity } from '../../domain/entities/role.entity';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import moment from 'moment-timezone';
import { RoleId } from '../../domain/value-objects/role-id.vo';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';

export class RoleDataAccessMapper {
  toOrmEntity(roleEntity: RoleEntity, method: OrmEntityMethod): RoleOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);
    const id = roleEntity.getId();

    const mediaOrmEntity = new RoleOrmEntity();
    if (id) {
      mediaOrmEntity.id = id.value;
    }
    mediaOrmEntity.name = roleEntity.name;
    mediaOrmEntity.guard_name = roleEntity.guardName;

    if (method === OrmEntityMethod.CREATE) {
      mediaOrmEntity.created_at = roleEntity.createdAt ?? new Date(now);
    }

    mediaOrmEntity.updated_at = new Date(now);

    return mediaOrmEntity;
  }

  toEntity(ormData: RoleOrmEntity): RoleEntity {
    return RoleEntity.builder()
      .setId(new RoleId(ormData.id))
      .setName(ormData.name)
      .setGuardName(ormData.guard_name)
      .setCreatedAt(ormData.created_at)
      .setUpdatedAt(ormData.updated_at)
      .build();
  }
}
