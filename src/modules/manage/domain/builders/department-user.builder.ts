import { DepartmentUserEntity } from "../entities/department-user.entity";
import { DepartmentUserId } from "../value-objects/department-user-id.vo";
import { UserId } from "../value-objects/user-id.vo";

export class DepartmentUserBuilder {
    departmentUserId: DepartmentUserId;
    departmentId: number;
    positionId: number;
    userId: number;
    username: string;
    email: string;
    password: string;
    tel: string;
    createdAt!: Date;
    updatedAt!: Date | null;
    deletedAt!: Date | null;

  setDepartmentUserId(value: DepartmentUserId): this {
    this.departmentUserId = value;
    return this;
  }

  setDepartmentId(departmentId: number): this {
    this.departmentId = departmentId;
    return this;
  }

  setPositionId(positionId: number): this {
    this.positionId = positionId;
    return this;
  }

  setUserId(value: number): this {
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

  build(): DepartmentUserEntity {
    return DepartmentUserEntity.create(this);
  }
}