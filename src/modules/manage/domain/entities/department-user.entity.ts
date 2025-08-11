import { Entity } from '@src/common/domain/entities/entity';
import { DepartmentUserBuilder } from '../builders/department-user.builder';
import { DepartmentUserId } from '../value-objects/department-user-id.vo';
import { DepartmentEntity } from './department.entity';
import { PositionEntity } from './position.entity';
import { UserEntity } from './user.entity';
import { UserTypeEntity } from './user-type.entity';

export class DepartmentUserEntity extends Entity<DepartmentUserId> {
  private readonly _departmentId: number;
  private readonly _positionId: number;
  private readonly _userID: number;
  private readonly _username: string;
  private readonly _email: string;
  private readonly _password: string;
  private readonly _tel: string;
  private readonly _line_manager_id: number;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date | null;
  private readonly _deletedAt: Date | null;
  private readonly _user: UserEntity;
  private readonly _user_type: UserTypeEntity[] | null;
  private readonly _department: DepartmentEntity;
  private readonly _position: PositionEntity;
  private readonly _line_manager: UserEntity | null;

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
    this._line_manager_id = builder.line_manager_id;
    this._createdAt = builder.createdAt;
    this._updatedAt = builder.updatedAt ?? null;
    this._deletedAt = builder.deletedAt ?? null;
    this._user = builder.user;
    this._user_type = builder.user_type;
    this._department = builder.department ?? null;
    this._position = builder.position ?? null;
    this._line_manager = builder.line_manager ?? null;
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

  get line_manager_id(): number {
    return this._line_manager_id;
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

  get user_type(): UserTypeEntity[] | null {
    return this._user_type;
  }

  get line_manager(): UserEntity | null {
    return this._line_manager;
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
