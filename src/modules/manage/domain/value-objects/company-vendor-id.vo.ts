import { BaseId } from '@src/common/domain/value-objects/base-id.vo';

export class CompanyVendorId extends BaseId<number> {
  constructor(value: number) {
    super(value);
    this.validate();
  }

  protected validate(): void {
    if (this.value <= 0) {
      throw new Error('Company vendor ID must be a positive number');
    }
  }

  public static create(value: number): CompanyVendorId {
    return new CompanyVendorId(value);
  }
}
