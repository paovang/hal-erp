import { PermissionEntity } from '../entities/permission.entity';
import { RoleEntity } from '../entities/role.entity';
import { UserSignatureEntity } from '../entities/user-signature.entity';
import { UserEntity } from '../entities/user.entity';
import { UserId } from '../value-objects/user-id.vo';

export class UserBuilder {
  userId: UserId;
  username: string;
  email: string;
  password: string;
  tel: string;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;
  roleIds: number[] | null = null;
  permissionIds: number[] | null = null;
  roles: RoleEntity[];
  permissions: PermissionEntity[] | null;
  userSignature: UserSignatureEntity | null = null;

  setUserId(value: UserId): this {
    this.userId = value;
    return this;
  }

  setUsername(username: string): this {
    this.username = username;
    return this;
  }

  setEmail(email: string): this {
    this.email = email;
    return this;
  }

  setPassword(password: string): this {
    this.password = password;
    return this;
  }

  setTel(tel: string): this {
    this.tel = tel;
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

  setUserSignature(userSignature: UserSignatureEntity | null): this {
    this.userSignature = userSignature;
    return this;
  }

  setRoleIds(roleIds: number[] | null): this {
    this.roleIds = roleIds;
    return this;
  }

  setPermissions(permissions: PermissionEntity[] | null): this {
    this.permissions = permissions;
    return this;
  }

  setPermissionIds(permissionIds: number[] | null): this {
    this.permissionIds = permissionIds;
    return this;
  }

  setRoles(roles: RoleEntity[]): this {
    this.roles = roles;
    return this;
  }

  build(): UserEntity {
    return UserEntity.create(this);
  }
}
