import { RoleOrmEntity } from '@src/common/infrastructure/database/typeorm/role.orm';
import { RoleEntity } from '../../domain/entities/role.entity';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import moment from 'moment-timezone';
import { RoleId } from '../../domain/value-objects/role-id.vo';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { PermissionEntity } from '../../domain/entities/permission.entity';
import { PermissionId } from '../../domain/value-objects/permission-id.vo';
import { DepartmentEntity } from '../../domain/entities/department.entity';
import { DepartmentId } from '../../domain/value-objects/department-id.vo';

export class RoleDataAccessMapper {
  toEntities(roleOrms: RoleOrmEntity[]): RoleEntity[] {
    return roleOrms.map((roleOrm) => this.toEntity(roleOrm));
  }

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
    const permissions = (ormData.permissions || []).map((perm) =>
      PermissionEntity.builder()
        .setId(new PermissionId(perm.id))
        .setName(perm.name)
        .setCreatedAt(perm.created_at)
        .setUpdatedAt(perm.updated_at)
        .setDeletedAt(perm.deleted_at)
        .build(),
    );

    // Assuming DepartmentEntity has a builder or constructor that accepts department ORM data
    const roleGroup =
      ormData.rolesGroups && ormData.rolesGroups.length > 0
        ? (() => {
            const builder = DepartmentEntity.builder();
            if (ormData.rolesGroups[0].department?.id) {
              builder.setDepartmentId(
                new DepartmentId(ormData.rolesGroups[0].department.id),
              );
            }
            return builder
              .setName(ormData.rolesGroups[0].department?.name)
              .setCode(ormData.rolesGroups[0].department?.code ?? '')
              .build();
          })()
        : undefined;

    const builder = RoleEntity.builder()
      .setId(new RoleId(ormData.id))
      .setName(ormData.name)
      .setGuardName(ormData.guard_name)
      .setCreatedAt(ormData.created_at)
      .setUpdatedAt(ormData.updated_at)
      .setDepartmentId(roleGroup?.getId()?.value ?? 0)
      .setDepartmentCode(roleGroup?.code ?? '')
      .setDepartmentName(roleGroup?.name ?? '')
      .setPermissions(permissions);

    const roleEntity = builder.build();

    return roleEntity;
  }
}
