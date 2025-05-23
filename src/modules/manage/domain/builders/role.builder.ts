import { RoleEntity } from '../entities/role.entity';
import { RoleId } from '../value-objects/role-id.vo';

export class RoleBuilder {
  roleId: RoleId;
  name: string;
  guard_name: string;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;

  setId(value: RoleId): this {
    this.roleId = value;
    return this;
  }

  setName(name: string): this {
    this.name = name;
    return this;
  }

  setGuardName(guard_name: string): this {
    this.guard_name = guard_name;
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

  build(): RoleEntity {
    return RoleEntity.create(this);
  }
}
