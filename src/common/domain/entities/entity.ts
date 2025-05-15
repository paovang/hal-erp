/**
 * Represents a base entity in the domain model.
 * Provides common functionality for entities such as equality comparison and hash code generation.
 */
export abstract class Entity<ID> {
  // Encapsulate the identifier field as private to control access and modification
  protected _id: ID;

  /**
   * Gets the identifier of the entity.
   * @returns {id} The identifier of the entity.
   */
  getId(): ID {
    return this._id;
  }

  setId(id: ID) {
    this._id = id;
  }

  updateIfNotNull<T>(target: T, updates: Partial<T>) {
    Object.keys(updates).forEach((key) => {
      const value = updates[key as keyof T];
      if (value !== null && value !== undefined) {
        target[key as keyof T] = value;
      }
    });
  }
}
