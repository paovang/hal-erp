import { UserEntity } from '../entities/user.entity';
import { UserId } from '../value-objects/user-id.vo';

export class UserBuilder {
  userId: UserId;
  username: string;
  email: string;
  password: string;
  tel: string;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;

  setUserId(value: UserId): this {
    this.userId = value;
    return this;
  }

  setUsername(username: string): this {
    this.username = username;
    return this;
  }

  setEmail(email: string): this {
    this.email = email;
    return this;
  }

  setPassword(password: string): this {
    this.password = password;
    return this;
  }

  setTel(tel: string): this {
    this.tel = tel;
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

  build(): UserEntity {
    return UserEntity.create(this);
  }
}
