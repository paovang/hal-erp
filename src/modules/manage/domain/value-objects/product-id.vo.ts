import { BaseId } from '@src/common/domain/value-objects/base-id.vo';

export class ProductId extends BaseId<number> {
  constructor(value: number) {
    super(value);
  }
}