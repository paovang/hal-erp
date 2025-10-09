import { Provider } from '@nestjs/common';
import { ReportPurchaseRequestProvider } from './reportPurchaseRequet';
import { ReportPurchaseOrderProvider } from './reportPurchaseOrder';

export const ReportRegisterProviders: Provider[] = [
  ...ReportPurchaseRequestProvider,
  ...ReportPurchaseOrderProvider,
];
