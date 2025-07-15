import { DepartmentEntity } from '@src/modules/manage/domain/entities/department.entity';
import { DepartmentId } from '@src/modules/manage/domain/value-objects/department-id.vo';
import { UserEntity } from '../entities/user.entity';

export class DepartmentBuilder {
  departmentId: DepartmentId;
  name: string;
  code: string;
  is_line_manager: boolean;
  department_head_id: number;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;
  department_head: UserEntity | null;

  setDepartmentId(value: DepartmentId): this {
    this.departmentId = value;
    return this;
  }

  setName(name: string): this {
    this.name = name;
    return this;
  }

  setCode(value: string): this {
    this.code = value;
    return this;
  }

  setIsLineManager(value: boolean): this {
    this.is_line_manager = value;
    return this;
  }

  setDepartmentHeadId(value: number): this {
    this.department_head_id = value;
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

  setDepartmentHead(department_head: UserEntity | null): this {
    this.department_head = department_head;
    return this;
  }

  build(): DepartmentEntity {
    return DepartmentEntity.create(this);
  }
}
