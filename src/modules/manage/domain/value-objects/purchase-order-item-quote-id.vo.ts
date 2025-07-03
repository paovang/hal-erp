import { BaseId } from '@src/common/domain/value-objects/base-id.vo';

export class PurchaseOrderItemQuoteId extends BaseId<number> {
  constructor(value: number) {
    super(value);
  }
}
