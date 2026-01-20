import { Entity } from '@src/common/domain/entities/entity';
import { PermissionId } from '../value-objects/permission-id.vo';
import { PermissionBuilder } from '../builders/permission.builder';
export class PermissionEntity extends Entity<PermissionId> {
  private readonly _name: string;
  private readonly _displayName: string;
  private readonly _displayNameLo: string;
  private readonly _type: string;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date | null;
  private readonly _deletedAt: Date | null;

  private constructor(builder: PermissionBuilder) {
    super();
    this.setId(builder.permissionId);
    this._name = builder.name;
    this._displayName = builder.display_name;
    this._displayNameLo = builder.display_name_lo;
    this._type = builder.type;
    this._createdAt = builder.createdAt;
    this._updatedAt = builder.updatedAt ?? null;
    this._deletedAt = builder.deletedAt ?? null;
  }

  get name(): string {
    return this._name;
  }

  get displayName(): string {
    return this._displayName;
  }

  get displayNameLo(): string {
    return this._displayNameLo;
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

  get type(): string {
    return this._type;
  }

  public static builder(): PermissionBuilder {
    return new PermissionBuilder();
  }

  static create(builder: PermissionBuilder): PermissionEntity {
    return new PermissionEntity(builder);
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

  async initializeUpdateSetId(permissionID: PermissionId) {
    this.setId(permissionID);
  }
}
