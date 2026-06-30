import { CompanyVendorEntity } from '../entities/company-vendor.entity';
import { CompanyVendorId } from '../value-objects/company-vendor-id.vo';

export class CompanyVendorBuilder {
  companyVendorId: CompanyVendorId;
  companyId: number;
  vendorId: number;
  company?: { id: number; name: string };
  vendor?: { id: number; name: string };
  status: 'active' | 'inactive';
  creditTermDays: number;
  creditLimit: number;
  paymentTerm?: string | null;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;

  setCompanyVendorId(value: CompanyVendorId): this {
    this.companyVendorId = value;
    return this;
  }

  setCompanyId(companyId: number): this {
    this.companyId = companyId;
    return this;
  }

  setVendorId(vendorId: number): this {
    this.vendorId = vendorId;
    return this;
  }

  setCompany(company: { id: number; name: string }): this {
    this.company = company;
    return this;
  }

  setVendor(vendor: { id: number; name: string }): this {
    this.vendor = vendor;
    return this;
  }

  setStatus(status: 'active' | 'inactive'): this {
    this.status = status;
    return this;
  }

  setCreditTermDays(creditTermDays: number): this {
    this.creditTermDays = creditTermDays;
    return this;
  }

  setCreditLimit(creditLimit: number): this {
    this.creditLimit = creditLimit;
    return this;
  }

  setPaymentTerm(paymentTerm: string | null): this {
    this.paymentTerm = paymentTerm;
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

  build(): CompanyVendorEntity {
    return CompanyVendorEntity.create(this);
  }
}
