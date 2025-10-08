import { Entity } from '@src/common/domain/entities/entity';
import { RoleGroupId } from '../value-objects/role-group-id.vo';
import { RoleGroupBuilder } from '../builders/role-group.builder';

export class RoleGroupEntity extends Entity<RoleGroupId> {
  private readonly _role_id: number;
  private readonly _department_id: number;

  private constructor(builder: RoleGroupBuilder) {
    super();
    this.setId(builder.roleGroupId);
    this._role_id = builder.role_id;
    this._department_id = builder.department_id;
  }

  get role_id(): number {
    return this._role_id;
  }

  get department_id(): number {
    return this._department_id;
  }

  public static builder(): RoleGroupBuilder {
    return new RoleGroupBuilder();
  }

  static create(builder: RoleGroupBuilder): RoleGroupEntity {
    return new RoleGroupEntity(builder);
  }

  static getEntityName() {
    return 'RoleGroup';
  }

  async validateExistingIdForUpdate() {
    if (!this.getId()) {
      console.log('phoudvang');
      // throw new UserDomainException(
      //   'users.user_is_not_in_correct_state_for_initialization',
      // );
    }
  }

  async initializeUpdateSetId(roleGroupID: RoleGroupId) {
    this.setId(roleGroupID);
  }
}
