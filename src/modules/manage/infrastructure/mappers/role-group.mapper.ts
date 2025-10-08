import { RoleGroupOrmEntity } from '@src/common/infrastructure/database/typeorm/role-group.orm';
import { RoleGroupEntity } from '../../domain/entities/role-group.entity';
import { RoleGroupId } from '../../domain/value-objects/role-group-id.vo';

export class RoleGroupDataAccessMapper {
  toOrmEntity(roleGroupEntity: RoleGroupEntity): RoleGroupOrmEntity {
    const id = roleGroupEntity.getId();

    const roleGroupOrmEntity = new RoleGroupOrmEntity();
    if (id) {
      roleGroupOrmEntity.id = id.value;
    }

    roleGroupOrmEntity.role_id = roleGroupEntity.role_id;
    roleGroupOrmEntity.department_id = roleGroupEntity.department_id;
    return roleGroupOrmEntity;
  }

  toEntity(ormData: RoleGroupOrmEntity): RoleGroupEntity {
    return RoleGroupEntity.builder()
      .setId(new RoleGroupId(ormData.id))
      .setRoleId(ormData.role_id)
      .setDepartmentId(ormData.department_id)
      .build();
  }
}
