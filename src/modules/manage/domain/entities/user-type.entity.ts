import { Entity } from '@src/common/domain/entities/entity';
import { BadRequestException } from '@nestjs/common';
import { UserTypeId } from '../value-objects/user-type-id.vo';
import { UserEntity } from './user.entity';
import { UserTypeBuilder } from '../builders/user-type.builder';

export class UserTypeEntity extends Entity<UserTypeId> {
  private readonly _name: string;
  private readonly _user_id: number;
  private readonly _user: UserEntity;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date | null;
  private readonly _deletedAt: Date | null;

  private constructor(builder: UserTypeBuilder) {
    super();
    this.setId(builder.userTypeId);
    this._name = builder.name;
    this._user_id = builder.user_id;
    this._user = builder.user;
    this._createdAt = builder.createdAt;
    this._updatedAt = builder.updatedAt ?? null;
    this._deletedAt = builder.deletedAt ?? null;
  }

  get name(): string {
    return this._name;
  }
  get user_id(): number {
    return this._user_id;
  }
  get user(): UserEntity {
    return this._user;
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

  public static builder(): UserTypeBuilder {
    return new UserTypeBuilder();
  }

  static create(builder: UserTypeBuilder): UserTypeEntity {
    return new UserTypeEntity(builder);
  }

  static getEntityAmount() {
    return 'user-type';
  }

  async validateExistingIdForUpdate() {
    if (!this.getId()) {
      throw new BadRequestException(
        'users.user_is_not_in_correct_state_for_initialization',
      );
    }
  }

  async initializeUpdateSetId(id: UserTypeId) {
    this.setId(id);
  }
}
