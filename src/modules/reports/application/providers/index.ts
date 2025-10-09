import { Provider } from '@nestjs/common';
import { ReportPurchaseRequestProvider } from './reportPurchaseRequet';

export const ReportRegisterProviders: Provider[] = [
  ...ReportPurchaseRequestProvider,
];
