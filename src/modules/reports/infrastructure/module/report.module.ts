import { CoreAuthModule } from '@core-system/auth';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UserModule } from '@src/common/infrastructure/auth/user.module';
import { UserService } from '@src/common/infrastructure/auth/user.service';
import { ReportRegisterProviders } from '../../application/providers';
import { ReportPurchaseRequestController } from '../../controllers/report-purchase-request.controller';
import { ReportPurchaseOrderController } from '../../controllers/report-purchase-order.controller';
import { ReportReceiptController } from '../../controllers/report-receipt.controller';
import { ReportCompanyController } from '../../controllers/report-company.controller';

@Module({
  imports: [
    CqrsModule,
    UserModule,
    CoreAuthModule.registerAsync({
      provide: 'USER_SERVICE',
      useExisting: UserService,
      imports: [UserModule],
    }),
  ],
  controllers: [
    ReportPurchaseRequestController,
    ReportPurchaseOrderController,
    ReportReceiptController,
    ReportCompanyController,
  ],
  providers: [...ReportRegisterProviders],
  exports: [...ReportRegisterProviders],
})
export class ReportModule {}
