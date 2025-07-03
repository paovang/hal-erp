import { BaseId } from '@src/common/domain/value-objects/base-id.vo';

export class DocumentStatusId extends BaseId<number> {
  constructor(value: number) {
    super(value);
  }
}
