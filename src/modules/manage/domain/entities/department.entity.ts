import { Entity } from '@src/common/domain/entities/entity';
import { DepartmentBuilder } from '@src/modules/manage/domain/builders/department.builder';
import { DepartmentId } from '@src/modules/manage/domain/value-objects/department-id.vo';
import { UserEntity } from './user.entity';
import { DepartmentType } from '@src/common/enums/department.enum';

export class DepartmentEntity extends Entity<DepartmentId> {
  private readonly _name: string;
  private readonly _code: string;
  private readonly _is_line_manager: boolean;
  private readonly _department_head_id: number;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date | null;
  private readonly _deletedAt: Date | null;
  private readonly _department_head: UserEntity | null;
  private readonly _type: DepartmentType;

  private constructor(builder: DepartmentBuilder) {
    super();
    this.setId(builder.departmentId);
    this._name = builder.name;
    this._code = builder.code;
    this._is_line_manager = builder.is_line_manager;
    this._department_head_id = builder.department_head_id;
    this._createdAt = builder.createdAt;
    this._updatedAt = builder.updatedAt ?? null;
    this._deletedAt = builder.deletedAt ?? null;
    this._department_head = builder.department_head ?? null;
    this._type = builder.type;
  }

  get name(): string {
    return this._name;
  }

  get code(): string {
    return this._code;
  }

  get is_line_manager(): boolean {
    return this._is_line_manager;
  }

  get department_head_id(): number {
    return this._department_head_id;
  }

  get type(): DepartmentType {
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

  get department_head(): UserEntity | null {
    return this._department_head;
  }

  public static builder(): DepartmentBuilder {
    return new DepartmentBuilder();
  }

  static create(builder: DepartmentBuilder): DepartmentEntity {
    return new DepartmentEntity(builder);
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

  async initializeUpdateSetId(departmentId: DepartmentId) {
    this.setId(departmentId);
  }
}
