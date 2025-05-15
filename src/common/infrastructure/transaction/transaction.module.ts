import { Module } from '@nestjs/common';
import { TransactionManagerService } from './transaction.service';
import { TRANSACTION_MANAGER_SERVICE } from 'src/common/constants/inject-key.const';

@Module({
  providers: [
    {
      provide: TRANSACTION_MANAGER_SERVICE,
      useClass: TransactionManagerService,
    },
  ],
  exports: [TRANSACTION_MANAGER_SERVICE],
})
export class TransactionModule {}
