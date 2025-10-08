import { RoleGroupEntity } from '../entities/role-group.entity';
import { RoleGroupId } from '../value-objects/role-group-id.vo';

export class RoleGroupBuilder {
  roleGroupId: RoleGroupId;
  role_id: number;
  department_id: number;

  setId(value: RoleGroupId): this {
    this.roleGroupId = value;
    return this;
  }

  setRoleId(role_id: number): this {
    this.role_id = role_id;
    return this;
  }

  setDepartmentId(department_id: number): this {
    this.department_id = department_id;
    return this;
  }

  build(): RoleGroupEntity {
    return RoleGroupEntity.create(this);
  }
}
