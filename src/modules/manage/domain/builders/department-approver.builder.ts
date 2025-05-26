import { DepartmentApproverEntity } from '../entities/department-approver.entity';
import { DepartmentEntity } from '../entities/department.entity';
import { UserEntity } from '../entities/user.entity';
import { DepartmentApproverId } from '../value-objects/department-approver-id.vo';

export class DepartmentApproverBuilder {
  departmentApproverId: DepartmentApproverId;
  department_id: number | null;
  user_id: number | null;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;
  user: UserEntity;
  department: DepartmentEntity;

  setDepartmentApproverId(value: DepartmentApproverId): this {
    this.departmentApproverId = value;
    return this;
  }

  setDepartmentId(department_id: number | null): this {
    this.department_id = department_id;
    return this;
  }

  setUserId(user_id: number | null): this {
    this.user_id = user_id;
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

  setUser(user: UserEntity): this {
    this.user = user;
    return this;
  }

  setDepartment(department: DepartmentEntity): this {
    this.department = department;
    return this;
  }

  build(): DepartmentApproverEntity {
    return DepartmentApproverEntity.create(this);
  }
}
