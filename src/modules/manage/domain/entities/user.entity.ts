import { UserId } from '../value-objects/user-id.vo';
import { UserBuilder } from '../builders/user.builder';
import { Entity } from '@src/common/domain/entities/entity';
import { RoleEntity } from './role.entity';
import { PermissionEntity } from './permission.entity';

export class UserEntity extends Entity<UserId> {
  private readonly _username: string;
  private readonly _email: string;
  private readonly _password: string;
  private readonly _tel: string;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date | null;
  private readonly _deletedAt: Date | null;
  private readonly _roleIds: number[] | null;
  private readonly _permissionIds: number[] | null;
  private readonly _roles: RoleEntity[];
  private readonly _permissions: PermissionEntity[] | null;

  private constructor(builder: UserBuilder) {
    super();
    this.setId(builder.userId);
    this._username = builder.username;
    this._email = builder.email;
    this._password = builder.password;
    this._tel = builder.tel;
    this._createdAt = builder.createdAt;
    this._updatedAt = builder.updatedAt ?? null;
    this._deletedAt = builder.deletedAt ?? null;
    this._roleIds = builder.roleIds ?? null;
    this._permissionIds = builder.permissionIds ?? null;
    this._roles = builder.roles;
    this._permissions = builder.permissions ?? null;
  }

  get username(): string {
    return this._username;
  }

  get email(): string {
    return this._email;
  }

  get password(): string {
    return this._password;
  }

  get tel(): string {
    return this._tel;
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

  get roleIds(): number[] | null {
    return this._roleIds;
  }

  get permissionIds(): number[] | null {
    return this._permissionIds;
  }

  get roles(): RoleEntity[] {
    return this._roles;
  }

  get permissions(): PermissionEntity[] | null {
    return this._permissions;
  }

  public static builder(): UserBuilder {
    return new UserBuilder();
  }

  static create(builder: UserBuilder): UserEntity {
    return new UserEntity(builder);
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

  async initializeUpdateSetId(userID: UserId) {
    this.setId(userID);
  }
}
