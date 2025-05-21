import { PermissionEntity } from "../entities/permission.entity";
import { PermissionId } from "../value-objects/permission-id.vo";

export class PermissionBuilder {
  permissionId: PermissionId;
  name: string;
  display_name: string;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;

  setId(value: PermissionId): this {
    this.permissionId = value;
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

  build(): PermissionEntity {
    return PermissionEntity.create(this);
  }
}