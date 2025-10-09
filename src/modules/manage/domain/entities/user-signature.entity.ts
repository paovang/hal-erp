import { Entity } from '@src/common/domain/entities/entity';
import { UserSignatureId } from '../value-objects/user-signature-id.vo';
import { UserSignatureBuilder } from '../builders/user-signature.builder';

export class UserSignatureEntity extends Entity<UserSignatureId> {
  private readonly _user_id: number;
  private readonly _signature: any;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date | null;
  private readonly _deletedAt: Date | null;

  private constructor(builder: UserSignatureBuilder) {
    super();
    this.setId(builder.userSignatureId);
    this._user_id = builder.user_id;
    this._signature = builder.signature;
    this._createdAt = builder.createdAt;
    this._updatedAt = builder.updatedAt ?? null;
    this._deletedAt = builder.deletedAt ?? null;
  }

  get userId(): number {
    return this._user_id;
  }

  get signature(): any {
    return this._signature;
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

  public static builder(): UserSignatureBuilder {
    return new UserSignatureBuilder();
  }

  static create(builder: UserSignatureBuilder): UserSignatureEntity {
    return new UserSignatureEntity(builder);
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

  async initializeUpdateSetId(userSignatureId: UserSignatureId) {
    this.setId(userSignatureId);
  }
}
