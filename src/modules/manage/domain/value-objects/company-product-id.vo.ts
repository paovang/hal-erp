import { BaseId } from '@src/common/domain/value-objects/base-id.vo';

export class CompanyProductId extends BaseId<number> {
  constructor(value: number) {
    super(value);
    this.validate();
  }

  protected validate(): void {
    if (this.value <= 0) {
      throw new Error('Company product ID must be a positive number');
    }
  }

  public static create(value: number): CompanyProductId {
    return new CompanyProductId(value);
  }
}
