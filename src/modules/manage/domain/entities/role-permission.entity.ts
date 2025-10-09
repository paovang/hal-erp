import { Entity } from '@src/common/domain/entities/entity';
import { RolePermissionBuilder } from '../builders/role-permission.builder';
import { RolePermissionId } from '../value-objects/role-permission-id.vo';

export class RolePermissionEntity extends Entity<RolePermissionId> {
  private readonly _role_id: number;
  private readonly _permission_id: number;

  private constructor(builder: RolePermissionBuilder) {
    super();
    this.setId(builder.rolePermissionId);
    this._role_id = builder.role_id;
    this._permission_id = builder.permission_id;
  }

  get role_id(): number {
    return this._role_id;
  }

  get permission_id(): number {
    return this._permission_id;
  }

  public static builder(): RolePermissionBuilder {
    return new RolePermissionBuilder();
  }

  static create(builder: RolePermissionBuilder): RolePermissionEntity {
    return new RolePermissionEntity(builder);
  }

  static getEntityName() {
    return 'RolePermission';
  }

  async validateExistingIdForUpdate() {
    if (!this.getId()) {
      console.log('phoudvang');
      // throw new UserDomainException(
      //   'users.user_is_not_in_correct_state_for_initialization',
      // );
    }
  }

  async initializeUpdateSetId(rolePermissionID: RolePermissionId) {
    this.setId(rolePermissionID);
  }
}
