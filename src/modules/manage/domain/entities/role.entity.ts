import { RoleId } from '../value-objects/role-id.vo';
import { RoleBuilder } from '../builders/role.builder';
import { Entity } from '@src/common/domain/entities/entity';
import { PermissionEntity } from './permission.entity';

export class RoleEntity extends Entity<RoleId> {
  private readonly _name: string;
  private readonly _guardName: string;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date | null;
  private readonly _deletedAt: Date | null;
  private readonly _permissions: PermissionEntity[];
  private readonly _department_id: number;
  private readonly _department_code: string;
  private readonly _department_name: string;
  private readonly _company_id: number;
  private readonly _company_name: string;
  private readonly _company_tel: string;
  private readonly _company_email: string;
  private readonly _company_logo: string;
  private readonly _company_address: string;

  private constructor(builder: RoleBuilder) {
    super();
    this.setId(builder.roleId);
    this._name = builder.name;
    this._guardName = builder.guard_name;
    this._createdAt = builder.createdAt;
    this._updatedAt = builder.updatedAt ?? null;
    this._deletedAt = builder.deletedAt ?? null;
    this._permissions = builder.permissions;
    this._department_id = builder.department_id;
    this._department_code = builder.department_code;
    this._department_name = builder.department_name;
    this._company_id = builder.company_id;
    this._company_name = builder.company_name;
    this._company_tel = builder.company_tel;
    this._company_email = builder.company_email;
    this._company_logo = builder.company_logo;
    this._company_address = builder.company_address;
  }

  get name(): string {
    return this._name;
  }

  get guardName(): string {
    return this._guardName;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date | null {
    return this._updatedAt;
  }

  get deletedAt(): Date | null {
    return this._deletedAt;
  }

  get permissions(): PermissionEntity[] {
    return this._permissions;
  }

  get department_id(): number {
    return this._department_id;
  }

  get department_code(): string {
    return this._department_code;
  }

  get department_name(): string {
    return this._department_name;
  }

  get company_id(): number {
    return this._company_id;
  }

  get company_name(): string {
    return this._company_name;
  }

  get company_tel(): string {
    return this._company_tel;
  }

  get company_email(): string {
    return this._company_email;
  }

  get company_logo(): string {
    return this._company_logo;
  }

  get company_address(): string {
    return this._company_address;
  }

  public static builder(): RoleBuilder {
    return new RoleBuilder();
  }

  static create(builder: RoleBuilder): RoleEntity {
    return new RoleEntity(builder);
  }

  static getEntityName() {
    return 'document_type';
  }

  async validateExistingIdForUpdate() {
    if (!this.getId()) {
      console.log('phoudvang');
      // throw new UserDomainException(
      //   'users.user_is_not_in_correct_state_for_initialization',
      // );
    }
  }

  async initializeUpdateSetId(roleID: RoleId) {
    this.setId(roleID);
  }
}
