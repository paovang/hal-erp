import { EntityManager } from 'typeorm';
import { UpdatePurchaseOrderSelectedVendorFileDto } from '../../dto/create/purchaseOrderSelectedVendor/update-file.dto';

export class UpdateFileCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdatePurchaseOrderSelectedVendorFileDto,
    public readonly manager: EntityManager,
  ) {}
}
