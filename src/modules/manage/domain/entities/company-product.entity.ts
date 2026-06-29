import { Entity } from '@src/common/domain/entities/entity';
import { CompanyProductId } from '../value-objects/company-product-id.vo';
import { CompanyProductBuilder } from '../builders/company-product.builder';

export class CompanyProductEntity extends Entity<CompanyProductId> {
  private readonly _companyId: number;
  private readonly _productId: number;
  private readonly _status: 'active' | 'inactive';
  private readonly _company?: { id: number; name: string };
  private readonly _product?: { id: number; name: string };
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date | null;
  private readonly _deletedAt: Date | null;

  private constructor(builder: CompanyProductBuilder) {
    super();
    this.setId(builder.companyProductId);
    this._companyId = builder.companyId;
    this._productId = builder.productId;
    this._status = builder.status;
    this._company = builder.company;
    this._product = builder.product;
    this._createdAt = builder.createdAt;
    this._updatedAt = builder.updatedAt ?? null;
    this._deletedAt = builder.deletedAt ?? null;
  }

  get companyId(): number {
    return this._companyId;
  }

  get productId(): number {
    return this._productId;
  }

  get status(): 'active' | 'inactive' {
    return this._status;
  }

  get company(): { id: number; name: string } | undefined {
    return this._company;
  }

  get product(): { id: number; name: string } | undefined {
    return this._product;
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

  public static builder(): CompanyProductBuilder {
    return new CompanyProductBuilder();
  }

  static create(builder: CompanyProductBuilder): CompanyProductEntity {
    return new CompanyProductEntity(builder);
  }

  static getEntityName() {
    return 'company-product';
  }

  async validateExistingIdForUpdate() {
    if (!this.getId()) {
      // console.log('company-product validation error');
    }
  }

  async initializeUpdateSetId(companyProductId: CompanyProductId) {
    this.setId(companyProductId);
  }
}
