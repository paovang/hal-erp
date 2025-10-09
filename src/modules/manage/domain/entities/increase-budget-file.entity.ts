import { Entity } from '@src/common/domain/entities/entity';
import { IncreaseBudgetFileId } from '../value-objects/increase-budget-file-id.vo';
import { BadRequestException } from '@nestjs/common';
import { IncreaseBudgetFileBuilder } from '../builders/increase-budget-file.builder';

export class IncreaseBudgetFileEntity extends Entity<IncreaseBudgetFileId> {
  private readonly _file_name: string;
  private readonly _increase_budget_id: number;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date | null;
  private readonly _deletedAt: Date | null;

  private constructor(builder: IncreaseBudgetFileBuilder) {
    super();
    this.setId(builder.increaseBudgetFileId);
    this._file_name = builder.file_name;
    this._increase_budget_id = builder.increase_budget_id;
    this._createdAt = builder.createdAt;
    this._updatedAt = builder.updatedAt ?? null;
    this._deletedAt = builder.deletedAt ?? null;
  }

  get file_name(): string {
    return this._file_name;
  }

  get increase_budget_id(): number {
    return this._increase_budget_id;
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

  public static builder(): IncreaseBudgetFileBuilder {
    return new IncreaseBudgetFileBuilder();
  }

  static create(builder: IncreaseBudgetFileBuilder): IncreaseBudgetFileEntity {
    return new IncreaseBudgetFileEntity(builder);
  }

  static getEntityName() {
    return 'IncreaseBudgetFile';
  }

  async validateExistingIdForUpdate() {
    if (!this.getId()) {
      console.log('phoudvang');
      throw new BadRequestException(
        'users.user_is_not_in_correct_state_for_initialization',
      );
    }
  }

  async initializeUpdateSetId(increaseBudgetFileID: IncreaseBudgetFileId) {
    this.setId(increaseBudgetFileID);
  }
}
