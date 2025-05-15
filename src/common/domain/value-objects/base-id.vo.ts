export abstract class BaseId<T> {
  private readonly _value: T;

  protected constructor(value: T) {
    this._value = value;
  }

  public get value(): T {
    return this._value;
  }
}
