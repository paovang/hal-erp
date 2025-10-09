import { UserSignatureEntity } from '../entities/user-signature.entity';
import { UserSignatureId } from '../value-objects/user-signature-id.vo';

export class UserSignatureBuilder {
  userSignatureId: UserSignatureId;
  user_id: number;
  signature: any;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;

  setUserSignatureId(value: UserSignatureId): this {
    this.userSignatureId = value;
    return this;
  }

  setUserId(user_id: number): this {
    this.user_id = user_id;
    return this;
  }

  setSignature(signature: any): this {
    this.signature = signature;
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

  build(): UserSignatureEntity {
    return UserSignatureEntity.create(this);
  }
}
