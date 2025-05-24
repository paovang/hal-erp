import { DepartmentEntity } from '@src/modules/manage/domain/entities/department.entity';
import { DepartmentId } from '@src/modules/manage/domain/value-objects/department-id.vo';

export class DepartmentBuilder {
  departmentId: DepartmentId;
  name: string;
  code: string;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;

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

  build(): DepartmentEntity {
    return DepartmentEntity.create(this);
  }
}
