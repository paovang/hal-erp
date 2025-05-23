import { Entity } from '@src/common/domain/entities/entity';
import { DepartmentBuilder } from '@src/modules/manage/domain/builders/department.builder';
import { DepartmentId } from '@src/modules/manage/domain/value-objects/department-id.vo';

export class DepartmentEntity extends Entity<DepartmentId> {
  private readonly _name: string;
  private readonly _code: string;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date | null;
  private readonly _deletedAt: Date | null;

  private constructor(builder: DepartmentBuilder) {
    super();
    this.setId(builder.departmentId);
    this._name = builder.name;
    this._code = builder.code;
    this._createdAt = builder.createdAt;
    this._updatedAt = builder.updatedAt ?? null;
    this._deletedAt = builder.deletedAt ?? null;
  }

  get name(): string {
    return this._name;
  }

  get code(): string {
    return this._code;
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
