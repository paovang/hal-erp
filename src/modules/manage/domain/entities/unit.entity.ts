import { Entity } from "@src/common/domain/entities/entity";
import { UnitBuilder } from "../builders/unit.builder";
import { UnitId } from "../value-objects/unit-id.vo";
import { BadRequestException } from "@nestjs/common";

export class UnitEntity extends Entity<UnitId> {
  private readonly _name: string;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date | null;
  private readonly _deletedAt: Date | null;

  private constructor(builder: UnitBuilder) {
    super();
    this.setId(builder.unitId);
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

  public static builder(): UnitBuilder {
    return new UnitBuilder();
  }

  static create(builder: UnitBuilder): UnitEntity {
    return new UnitEntity(builder);
  }

  static getEntityName() {
    return 'document_type';
  }

  async validateExistingIdForUpdate() {
    if (!this.getId()) {
      console.log('phoudvang');
      throw new BadRequestException(
        'users.user_is_not_in_correct_state_for_initialization',
      );
    }
  }

  async initializeUpdateSetId(unitID: UnitId) {
    this.setId(unitID);
  }
}