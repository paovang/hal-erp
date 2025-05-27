import { Entity } from '@src/common/domain/entities/entity';
import { VendorId } from '../value-objects/vendor-id.vo';
import { VendorBuilder } from '../builders/vendor.builder';
import { BadRequestException } from '@nestjs/common';

export class VendorEntity extends Entity<VendorId> {
  private readonly _name: string;
  private readonly _contactInfo: string;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date | null;
  private readonly _deletedAt: Date | null;

  private constructor(builder: VendorBuilder) {
    super();
    this.setId(builder.vendorId);
    this._name = builder.name;
    this._contactInfo = builder.contact_info;
    this._createdAt = builder.createdAt;
    this._updatedAt = builder.updatedAt ?? null;
    this._deletedAt = builder.deletedAt ?? null;
  }

  get name(): string {
    return this._name;
  }

  get contactInfo(): string {
    return this._contactInfo;
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

  public static builder(): VendorBuilder {
    return new VendorBuilder();
  }

  static create(builder: VendorBuilder): VendorEntity {
    return new VendorEntity(builder);
  }

  static getEntityName() {
    return 'unit';
  }

  async validateExistingIdForUpdate() {
    if (!this.getId()) {
      console.log('phoudvang');
      throw new BadRequestException(
        'users.user_is_not_in_correct_state_for_initialization',
      );
    }
  }

  async initializeUpdateSetId(vendorID: VendorId) {
    this.setId(vendorID);
  }
}
