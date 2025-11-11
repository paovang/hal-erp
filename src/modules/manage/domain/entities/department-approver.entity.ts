import { Entity } from '@src/common/domain/entities/entity';
import { DepartmentApproverBuilder } from '../builders/department-approver.builder';
import { DepartmentApproverId } from '../value-objects/department-approver-id.vo';
import { UserEntity } from './user.entity';
import { DepartmentEntity } from './department.entity';
import { CompanyEntity } from './company.entity';

export class DepartmentApproverEntity extends Entity<DepartmentApproverId> {
  private readonly _departmentId: number | null;
  private readonly _userId: number | null;
  private readonly _company_id: number | null;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date | null;
  private readonly _deletedAt: Date | null;
  private readonly _user: UserEntity;
  private readonly _department: DepartmentEntity;
  private readonly _company: CompanyEntity | null;

  private constructor(builder: DepartmentApproverBuilder) {
    super();
    this.setId(builder.departmentApproverId);
    this._departmentId = builder.department_id;
    this._userId = builder.user_id;
    this._company_id = builder.company_id;
    this._createdAt = builder.createdAt;
    this._updatedAt = builder.updatedAt ?? null;
    this._deletedAt = builder.deletedAt ?? null;
    this._department = builder.department;
    this._user = builder.user;
    this._company = builder.company ?? null;
  }

  get departmentId(): number | null {
    return this._departmentId;
  }

  get userId(): number | null {
    return this._userId;
  }

  get companyId(): number | null {
    return this._company_id;
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

  get user(): UserEntity {
    return this._user;
  }

  get company(): CompanyEntity | null {
    return this._company;
  }

  public static builder(): DepartmentApproverBuilder {
    return new DepartmentApproverBuilder();
  }

  static create(builder: DepartmentApproverBuilder): DepartmentApproverEntity {
    return new DepartmentApproverEntity(builder);
  }

  static getEntityName() {
    return 'category';
  }

  async validateExistingIdForUpdate() {
    if (!this.getId()) {
      console.log('phoudvang');
      // throw new UserDomainException(
      //   'users.user_is_not_in_correct_state_for_initialization',
      // );
    }
  }

  async initializeUpdateSetId(departmentApproverId: DepartmentApproverId) {
    this.setId(departmentApproverId);
  }
}
