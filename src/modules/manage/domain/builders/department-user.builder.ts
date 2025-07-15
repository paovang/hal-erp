import { DepartmentUserEntity } from '../entities/department-user.entity';
import { DepartmentEntity } from '../entities/department.entity';
import { PositionEntity } from '../entities/position.entity';
import { UserEntity } from '../entities/user.entity';
import { DepartmentUserId } from '../value-objects/department-user-id.vo';

export class DepartmentUserBuilder {
  departmentUserId: DepartmentUserId;
  departmentId: number;
  positionId: number;
  userId: number;
  username: string;
  email: string;
  password: string;
  tel: string;
  line_manager_id: number;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;
  department: DepartmentEntity;
  user: UserEntity;
  position: PositionEntity;
  line_manager: UserEntity;

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

  setLineManagerId(line_manager_id: number): this {
    this.line_manager_id = line_manager_id;
    return this;
  }

  setDepartment(department: DepartmentEntity): this {
    this.department = department;
    return this;
  }

  setPosition(position: PositionEntity): this {
    this.position = position;
    return this;
  }

  setUser(user: UserEntity): this {
    this.user = user;
    return this;
  }

  setLineManager(line_manager: UserEntity): this {
    this.line_manager = line_manager;
    return this;
  }

  build(): DepartmentUserEntity {
    return DepartmentUserEntity.create(this);
  }
}
