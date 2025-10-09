import { RolePermissionEntity } from '../entities/role-permission.entity';
import { RolePermissionId } from '../value-objects/role-permission-id.vo';

export class RolePermissionBuilder {
  rolePermissionId: RolePermissionId;
  role_id: number;
  permission_id: number;

  setId(value: RolePermissionId): this {
    this.rolePermissionId = value;
    return this;
  }

  setRoleId(role_id: number): this {
    this.role_id = role_id;
    return this;
  }

  setPermissionId(permission_id: number): this {
    this.permission_id = permission_id;
    return this;
  }

  build(): RolePermissionEntity {
    return RolePermissionEntity.create(this);
  }
}
