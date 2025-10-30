import { Entity } from '@src/common/domain/entities/entity';
import { CompanyUserBuilder } from '../builders/company-user.builder';
import { CompanyUserId } from '../value-objects/company-user-id.vo';
import { UserEntity } from './user.entity';
import { CompanyEntity } from './company.entity';

export class CompanyUserEntity extends Entity<CompanyUserId> {
  private readonly _company_id: number;
  private readonly _user_id: number;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date | null;
  private readonly _deletedAt: Date | null;
  private readonly _user: UserEntity | null;
  private readonly _company: CompanyEntity | null;

  private constructor(builder: CompanyUserBuilder) {
    super();
    this.setId(builder.companyUserId);
    this._company_id = builder.company_id;
    this._user_id = builder.user_id;
    this._createdAt = builder.createdAt;
    this._updatedAt = builder.updatedAt ?? null;
    this._deletedAt = builder.deletedAt ?? null;
    this._user = builder.user ?? null;
    this._company = builder.company ?? null;
  }

  get company_id(): number {
    return this._company_id;
  }

  get user_id(): number {
    return this._user_id;
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

  get user(): UserEntity | null {
    return this._user;
  }

  get company(): CompanyEntity | null {
    return this._company;
  }

  public static builder(): CompanyUserBuilder {
    return new CompanyUserBuilder();
  }

  static create(builder: CompanyUserBuilder): CompanyUserEntity {
    return new CompanyUserEntity(builder);
  }

  static getEntityName() {
    return 'companies';
  }

  async validateExistingIdForUpdate() {
    if (!this.getId()) {
      console.log('company validation error');
      // throw new CompanyDomainException(
      //   'companies.company_is_not_in_correct_state_for_initialization',
      // );
    }
  }

  async initializeUpdateSetId(companyUserId: CompanyUserId) {
    this.setId(companyUserId);
  }
}
