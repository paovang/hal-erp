import { PermissionGroupEntity } from "../entities/permission-group.entity";
import { PermissionEntity } from "../entities/permission.entity";
import { PermissionGroupId } from "../value-objects/permission-group-id.vo";

export class PermissionGroupBuilder {
  permissionGroupId: PermissionGroupId;
  name: string;
  display_name: string;
  type: string;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;
  permissions: PermissionEntity[];

  setId(value: PermissionGroupId): this {
    this.permissionGroupId = value;
    return this;
  }

  setName(name: string): this {
    this.name = name;
    return this;
  }

  setDisplayName(display_name: string): this {
    this.display_name = display_name;
    return this;
  }

  setType(type: string): this {
    this.type = type;
    return this;
  }

  setCreatedAt(createdAt: Date): this {
    this.createdAt = createdAt;
    return this;
  }

  setUpdatedAt(updatedAt: Date | null): this {
    this.updatedAt = updatedAt;
    return this;
  }

  setDeletedAt(deletedAt: Date | null): this {
    this.deletedAt = deletedAt;
    return this;
  }

  setPermissions(permissions: PermissionEntity[]): this {
    this.permissions = permissions;
    return this;
  }

  build(): PermissionGroupEntity {
    return PermissionGroupEntity.create(this);
  }
}