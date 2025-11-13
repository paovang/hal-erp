import { PermissionEntity } from '../entities/permission.entity';
import { RoleEntity } from '../entities/role.entity';
import { RoleId } from '../value-objects/role-id.vo';

export class RoleBuilder {
  roleId: RoleId;
  name: string;
  guard_name: string;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;
  permissions!: PermissionEntity[];
  department_id: number;
  department_code: string;
  department_name: string;
  company_id: number;
  company_name: string;
  company_tel: string;
  company_email: string;
  company_logo: string;
  company_address: string;

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

  setPermissions(permissions: PermissionEntity[]): this {
    this.permissions = permissions;
    return this;
  }

  setDepartmentId(department_id: number): this {
    this.department_id = department_id;
    return this;
  }

  setDepartmentCode(department_code: string): this {
    this.department_code = department_code;
    return this;
  }

  setDepartmentName(department_name: string): this {
    this.department_name = department_name;
    return this;
  }

  setCompanyId(company_id: number): this {
    this.company_id = company_id;
    return this;
  }

  setCompanyName(company_name: string): this {
    this.company_name = company_name;
    return this;
  }

  setCompanyTel(company_tel: string): this {
    this.company_tel = company_tel;
    return this;
  }

  setCompanyEmail(company_email: string): this {
    this.company_email = company_email;
    return this;
  }

  setCompanyLogo(company_logo: string): this {
    this.company_logo = company_logo;
    return this;
  }

  setCompanyAddress(company_address: string): this {
    this.company_address = company_address;
    return this;
  }

  build(): RoleEntity {
    return RoleEntity.create(this);
  }
}
