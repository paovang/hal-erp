import { Provider } from '@nestjs/common';
import { ReportPurchaseRequestProvider } from './reportPurchaseRequet';
import { ReportPurchaseOrderProvider } from './reportPurchaseOrder';
import { ReportReceiptProvider } from './reportReceipt';

export const ReportRegisterProviders: Provider[] = [
  ...ReportPurchaseRequestProvider,
  ...ReportPurchaseOrderProvider,
  ...ReportReceiptProvider,
];
