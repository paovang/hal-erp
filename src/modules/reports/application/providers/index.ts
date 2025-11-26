import { Provider } from '@nestjs/common';
import { ReportPurchaseRequestProvider } from './reportPurchaseRequet';
import { ReportPurchaseOrderProvider } from './reportPurchaseOrder';
import { ReportReceiptProvider } from './reportReceipt';
import { ReportCompanyProvider } from './reportCompany';

export const ReportRegisterProviders: Provider[] = [
  ...ReportPurchaseRequestProvider,
  ...ReportPurchaseOrderProvider,
  ...ReportReceiptProvider,
  ...ReportCompanyProvider,
];
