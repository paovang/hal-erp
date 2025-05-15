// src/common/domain/value-objects/uuid.vo.ts

export class UUID {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static create(value: string): UUID {
    if (!value || value.length !== 36) {
      throw new Error('Invalid UUID format');
    }
    return new UUID(value);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: UUID): boolean {
    return this.value === other.value;
  }
}
