import { DepartmentEntity } from '@src/modules/manage/domain/entities/department.entity';
import { DepartmentId } from '@src/modules/manage/domain/value-objects/department-id.vo';
import { UserEntity } from '../entities/user.entity';
import { DepartmentType } from '@src/common/enums/department.enum';
import { CompanyEntity } from '../entities/company.entity';

export class DepartmentBuilder {
  departmentId: DepartmentId;
  name: string;
  code: string;
  is_line_manager: boolean;
  department_head_id: number;
  company_id: number;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;
  department_head: UserEntity | null;
  type: DepartmentType;
  company: CompanyEntity | null;

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

  setCompanyId(value: number): this {
    this.company_id = value;
    return this;
  }

  setType(value: DepartmentType): this {
    this.type = value;
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

  setCompany(company: CompanyEntity | null): this {
    this.company = company;
    return this;
  }

  build(): DepartmentEntity {
    return DepartmentEntity.create(this);
  }
}
