import { UserTypeEntity } from '../entities/user-type.entity';
import { UserEntity } from '../entities/user.entity';
import { UserTypeId } from '../value-objects/user-type-id.vo';

export class UserTypeBuilder {
  userTypeId: UserTypeId;
  name: string;
  user_id: number;
  user: UserEntity;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;

  setUserTypeId(value: UserTypeId): this {
    this.userTypeId = value;
    return this;
  }

  setName(name: string): this {
    this.name = name;
    return this;
  }
  setUserId(user_id: number): this {
    this.user_id = user_id;
    return this;
  }
  setUser(user: UserEntity): this {
    this.user = user;
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

  build(): UserTypeEntity {
    return UserTypeEntity.create(this);
  }
}
