import { Entity } from '@src/common/domain/entities/entity';
import { PositionId } from '../value-objects/position-id.vo';
import { PositionBuilder } from '../builders/position.builder';
import { BadRequestException } from '@nestjs/common';
import { CompanyEntity } from './company.entity';

export class PositionEntity extends Entity<PositionId> {
  private readonly _name: string;
  private readonly _company_id: number;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date | null;
  private readonly _deletedAt: Date | null;
  private readonly _company: CompanyEntity | null;

  private constructor(builder: PositionBuilder) {
    super();
    this.setId(builder.positionId);
    this._name = builder.name;
    this._company_id = builder.company_id;
    this._createdAt = builder.createdAt;
    this._updatedAt = builder.updatedAt ?? null;
    this._deletedAt = builder.deletedAt ?? null;
    this._company = builder.company ?? null;
  }

  get name(): string {
    return this._name;
  }

  get company_id(): number {
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

  get company(): CompanyEntity | null {
    return this._company;
  }

  public static builder(): PositionBuilder {
    return new PositionBuilder();
  }

  static create(builder: PositionBuilder): PositionEntity {
    return new PositionEntity(builder);
  }

  static getEntityName() {
    return 'position';
  }

  async validateExistingIdForUpdate() {
    if (!this.getId()) {
      console.log('phoudvang');
      throw new BadRequestException(
        'users.user_is_not_in_correct_state_for_initialization',
      );
    }
  }

  async initializeUpdateSetId(positionID: PositionId) {
    this.setId(positionID);
  }
}
