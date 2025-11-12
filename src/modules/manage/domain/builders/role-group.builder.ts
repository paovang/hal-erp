import { CompanyEntity } from '../entities/company.entity';
import { RoleGroupEntity } from '../entities/role-group.entity';
import { RoleGroupId } from '../value-objects/role-group-id.vo';

export class RoleGroupBuilder {
  roleGroupId: RoleGroupId;
  role_id: number;
  department_id: number;
  company_id: number;
  company: CompanyEntity | null;

  setId(value: RoleGroupId): this {
    this.roleGroupId = value;
    return this;
  }

  setRoleId(role_id: number): this {
    this.role_id = role_id;
    return this;
  }

  setDepartmentId(department_id: number): this {
    this.department_id = department_id;
    return this;
  }

  setCompanyId(company_id: number): this {
    this.company_id = company_id;
    return this;
  }

  setCompany(company: CompanyEntity | null): this {
    this.company = company;
    return this;
  }

  build(): RoleGroupEntity {
    return RoleGroupEntity.create(this);
  }
}
