import { Provider } from '@nestjs/common';
import { UpdateFileCommandHandler } from '../../commands/purchaseOrderSelectedVendor/handler/update-file.command.handler';

export const PurchaseOrderSelectedVendorHandlersProviders: Provider[] = [
  UpdateFileCommandHandler,
];
