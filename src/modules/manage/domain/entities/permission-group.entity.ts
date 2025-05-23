import { Entity } from '@src/common/domain/entities/entity';
import { PermissionGroupId } from '../value-objects/permission-group-id.vo';
import { PermissionGroupBuilder } from '../builders/permission-group.builder';
import { PermissionEntity } from './permission.entity';

export class PermissionGroupEntity extends Entity<PermissionGroupId> {
  private readonly _name: string;
  private readonly _displayName: string;
  private readonly _type: string;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date | null;
  private readonly _deletedAt: Date | null;
  private readonly _permissions: PermissionEntity[];

  private constructor(builder: PermissionGroupBuilder) {
    super();
    this.setId(builder.permissionGroupId);
    this._name = builder.name;
    this._displayName = builder.display_name;
    this._type = builder.type;
    this._permissions = builder.permissions ?? [];
  }

  get name(): string {
    return this._name;
  }

  get displayName(): string {
    return this._displayName;
  }

  get type(): string {
    return this._type;
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

  public static builder(): PermissionGroupBuilder {
    return new PermissionGroupBuilder();
  }

  static create(builder: PermissionGroupBuilder): PermissionGroupEntity {
    return new PermissionGroupEntity(builder);
  }

  static getEntityName() {
    return 'permission_group';
  }

  async validateExistingIdForUpdate() {
    if (!this.getId()) {
      console.log('phoudvang');
      // throw new UserDomainException(
      //   'users.user_is_not_in_correct_state_for_initialization',
      // );
    }
  }

  async initializeUpdateSetId(permissionGroupID: PermissionGroupId) {
    this.setId(permissionGroupID);
  }
}
