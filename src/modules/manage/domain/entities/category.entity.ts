import { Entity } from '@src/common/domain/entities/entity';
import { CategoryId } from '../value-objects/category-id.vo';
import { CategoryBuilder } from '../builders/category.builder';

export class CategoryEntity extends Entity<CategoryId> {
  private readonly _code: string;
  private readonly _name: string;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date | null;
  private readonly _deletedAt: Date | null;

  private constructor(builder: CategoryBuilder) {
    super();
    this.setId(builder.categoryId);
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

  public static builder(): CategoryBuilder {
    return new CategoryBuilder();
  }

  static create(builder: CategoryBuilder): CategoryEntity {
    return new CategoryEntity(builder);
  }

  static getEntityName() {
    return 'category';
  }

  async validateExistingIdForUpdate() {
    if (!this.getId()) {
      console.log('phoudvang');
      // throw new UserDomainException(
      //   'users.user_is_not_in_correct_state_for_initialization',
      // );
    }
  }

  async initializeUpdateSetId(categoryId: CategoryId) {
    this.setId(categoryId);
  }
}
