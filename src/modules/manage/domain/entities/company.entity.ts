import { Entity } from '@src/common/domain/entities/entity';
import { CompanyBuilder } from '@src/modules/manage/domain/builders/company.builder';
import { CompanyId } from '@src/modules/manage/domain/value-objects/company-id.vo';

export class CompanyEntity extends Entity<CompanyId> {
  private readonly _name: string;
  private readonly _logo: string;
  private readonly _tel: string;
  private readonly _email: string;
  private readonly _address: string;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date | null;
  private readonly _deletedAt: Date | null;

  private constructor(builder: CompanyBuilder) {
    super();
    this.setId(builder.companyId);
    this._name = builder.name;
    this._logo = builder.logo;
    this._tel = builder.tel;
    this._email = builder.email;
    this._address = builder.address;
    this._createdAt = builder.createdAt;
    this._updatedAt = builder.updatedAt ?? null;
    this._deletedAt = builder.deletedAt ?? null;
  }

  get name(): string {
    return this._name;
  }

  get logo(): string {
    return this._logo;
  }

  get tel(): string {
    return this._tel;
  }

  get email(): string {
    return this._email;
  }

  get address(): string {
    return this._address;
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

  public static builder(): CompanyBuilder {
    return new CompanyBuilder();
  }

  static create(builder: CompanyBuilder): CompanyEntity {
    return new CompanyEntity(builder);
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

  async initializeUpdateSetId(companyId: CompanyId) {
    this.setId(companyId);
  }
}
