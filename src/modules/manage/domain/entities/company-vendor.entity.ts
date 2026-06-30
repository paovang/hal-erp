import { Entity } from '@src/common/domain/entities/entity';
import { BadRequestException } from '@nestjs/common';
import { CompanyVendorId } from '../value-objects/company-vendor-id.vo';
import { CompanyVendorBuilder } from '../builders/company-vendor.builder';

export class CompanyVendorEntity extends Entity<CompanyVendorId> {
  private readonly _companyId: number;
  private readonly _vendorId: number;
  private readonly _company?: { id: number; name: string };
  private readonly _vendor?: { id: number; name: string };
  private readonly _status: 'active' | 'inactive';
  private readonly _creditTermDays: number;
  private readonly _creditLimit: number;
  private readonly _paymentTerm: string | null;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date | null;
  private readonly _deletedAt: Date | null;

  private constructor(builder: CompanyVendorBuilder) {
    super();
    this.setId(builder.companyVendorId);
    this._companyId = builder.companyId;
    this._vendorId = builder.vendorId;
    this._company = builder.company;
    this._vendor = builder.vendor;
    this._status = builder.status ?? 'active';
    this._creditTermDays = builder.creditTermDays ?? 0;
    this._creditLimit = builder.creditLimit ?? 0;
    this._paymentTerm = builder.paymentTerm ?? null;
    this._createdAt = builder.createdAt;
    this._updatedAt = builder.updatedAt ?? null;
    this._deletedAt = builder.deletedAt ?? null;
  }

  get companyId(): number {
    return this._companyId;
  }

  get vendorId(): number {
    return this._vendorId;
  }

  get company(): { id: number; name: string } | undefined {
    return this._company;
  }

  get vendor(): { id: number; name: string } | undefined {
    return this._vendor;
  }

  get status(): 'active' | 'inactive' {
    return this._status;
  }

  get creditTermDays(): number {
    return this._creditTermDays;
  }

  get creditLimit(): number {
    return this._creditLimit;
  }

  get paymentTerm(): string | null {
    return this._paymentTerm;
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

  public static builder(): CompanyVendorBuilder {
    return new CompanyVendorBuilder();
  }

  static create(builder: CompanyVendorBuilder): CompanyVendorEntity {
    return new CompanyVendorEntity(builder);
  }

  static getEntityName() {
    return 'company-vendor';
  }

  async validateExistingIdForUpdate() {
    if (!this.getId()) {
      throw new BadRequestException(
        'users.user_is_not_in_correct_state_for_initialization',
      );
    }
  }

  async initializeUpdateSetId(companyVendorId: CompanyVendorId) {
    this.setId(companyVendorId);
  }
}
