import { Entity } from '@src/common/domain/entities/entity';
import { DepartmentUserBuilder } from '../builders/department-user.builder';
import { DepartmentUserId } from '../value-objects/department-user-id.vo';
import { DepartmentEntity } from './department.entity';
import { PositionEntity } from './position.entity';
import { UserEntity } from './user.entity';

export class DepartmentUserEntity extends Entity<DepartmentUserId> {
  private readonly _departmentId: number;
  private readonly _positionId: number;
  private readonly _userID: number;
  private readonly _username: string;
  private readonly _email: string;
  private readonly _password: string;
  private readonly _tel: string;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date | null;
  private readonly _deletedAt: Date | null;
  private readonly _user: UserEntity;
  private readonly _department: DepartmentEntity;
  private readonly _position: PositionEntity;

  private constructor(builder: DepartmentUserBuilder) {
    super();
    this.setId(builder.departmentUserId);
    this._departmentId = builder.departmentId;
    this._positionId = builder.positionId;
    this._userID = builder.userId;
    this._username = builder.username;
    this._email = builder.email;
    this._password = builder.password;
    this._tel = builder.tel;
    this._createdAt = builder.createdAt;
    this._updatedAt = builder.updatedAt ?? null;
    this._deletedAt = builder.deletedAt ?? null;
    this._user = builder.user;
    this._department = builder.department ?? null;
    this._position = builder.position ?? null;
  }

  get departmentId(): number {
    return this._departmentId;
  }

  get positionId(): number {
    return this._positionId;
  }

  get userId(): number {
    return this._userID;
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

  get department(): DepartmentEntity {
    return this._department;
  }

  get position(): PositionEntity {
    return this._position;
  }

  get user(): UserEntity {
    return this._user;
  }

  public static builder(): DepartmentUserBuilder {
    return new DepartmentUserBuilder();
  }

  static create(builder: DepartmentUserBuilder): DepartmentUserEntity {
    return new DepartmentUserEntity(builder);
  }

  static getEntityName() {
    return 'departments';
  }

  async validateExistingIdForUpdate() {
    if (!this.getId()) {
      console.log('paovang');
      // throw new UserDomainException(
      //   'users.user_is_not_in_correct_state_for_initialization',
      // );
    }
  }

  async initializeUpdateSetId(departmentUserId: DepartmentUserId) {
    this.setId(departmentUserId);
  }
}
