import { PermissionOrmEntity } from '@src/common/infrastructure/database/typeorm/permission.orm';
import { PermissionEntity } from '../../domain/entities/permission.entity';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import moment from 'moment-timezone';
import { PermissionId } from '../../domain/value-objects/permission-id.vo';
import { PermissionGroupOrmEntity } from '@src/common/infrastructure/database/typeorm/permission-group.orm';
import { PermissionGroupEntity } from '../../domain/entities/permission-group.entity';
import { PermissionGroupId } from '../../domain/value-objects/permission-group-id.vo';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';

export class PermissionDataAccessMapper {
  toEntities(ormPermissions: PermissionOrmEntity[]): PermissionEntity[] {
    return ormPermissions.map((ormData) =>
      PermissionEntity.builder()
        .setId(new PermissionId(ormData.id))
        .setName(ormData.name)
        .setDisplayName(ormData.display_name)
        .setCreatedAt(ormData.created_at)
        .setUpdatedAt(ormData.updated_at)
        .setDeletedAt(ormData.deleted_at)
        .build(),
    );
  }

  toOrmEntity(
    roleEntity: PermissionEntity,
    method: OrmEntityMethod,
  ): PermissionOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);
    const id = roleEntity.getId();

    const mediaOrmEntity = new PermissionOrmEntity();
    if (id) {
      mediaOrmEntity.id = id.value;
    }
    mediaOrmEntity.name = roleEntity.name;
    mediaOrmEntity.display_name = roleEntity.displayName;
    if (method === OrmEntityMethod.CREATE) {
      mediaOrmEntity.created_at = roleEntity.createdAt ?? new Date(now);
    }
    mediaOrmEntity.updated_at = new Date(now);

    return mediaOrmEntity;
  }

  toEntity(ormData: PermissionGroupOrmEntity): PermissionGroupEntity {
    const permissions = (ormData.permissions || []).map((p) =>
      PermissionEntity.builder()
        .setId(new PermissionId(p.id))
        .setName(p.name)
        .setDisplayName(p.display_name)
        .setCreatedAt(p.created_at)
        .setUpdatedAt(p.updated_at)
        .setDeletedAt(p.deleted_at)
        .build(),
    );

    return PermissionGroupEntity.builder()
      .setId(new PermissionGroupId(ormData.id))
      .setName(ormData.name)
      .setDisplayName(ormData.display_name)
      .setType(ormData.type)
      .setPermissions(permissions)
      .build();
  }
}
