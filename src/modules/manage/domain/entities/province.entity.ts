import { Entity } from '@src/common/domain/entities/entity';
import { ProvinceId } from '../value-objects/province-id.vo';
import { ProvinceBuilder } from '../builders/province.builder';
import { BadRequestException } from '@nestjs/common';

export class ProvinceEntity extends Entity<ProvinceId> {
  private readonly _name: string;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date | null;
  private readonly _deletedAt: Date | null;

  private constructor(builder: ProvinceBuilder) {
    super();
    this.setId(builder.provinceId);
    this._name = builder.name;
    this._createdAt = builder.createdAt;
    this._updatedAt = builder.updatedAt ?? null;
    this._deletedAt = builder.deletedAt ?? null;
  }

  get name(): string {
    return this._name;
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

  public static builder(): ProvinceBuilder {
    return new ProvinceBuilder();
  }

  static create(builder: ProvinceBuilder): ProvinceEntity {
    return new ProvinceEntity(builder);
  }

  static getEntityName() {
    return 'Province';
  }

  async validateExistingIdForUpdate() {
    if (!this.getId()) {
      console.log('phoudvang');
      throw new BadRequestException(
        'users.user_is_not_in_correct_state_for_initialization',
      );
    }
  }

  async initializeUpdateSetId(provinceID: ProvinceId) {
    this.setId(provinceID);
  }
}
