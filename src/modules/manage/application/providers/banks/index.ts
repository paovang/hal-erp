import { Provider } from '@nestjs/common';
import {
  BANK_APPLICATION_SERVICE,
  READ_BANK_REPOSITORY,
  WRITE_BANK_REPOSITORY,
} from '../../constants/inject-key.const';
import {
  LOCALIZATION_SERVICE,
  TRANSACTION_MANAGER_SERVICE,
} from '@src/common/constants/inject-key.const';
import { BankHandlersProviders } from './command.provider';
import { LocalizationService } from '@src/common/infrastructure/localization/localization.service';
import { TransactionManagerService } from '@src/common/infrastructure/transaction/transaction.service';
import { BankService } from '../../services/bank-detail.service';
import { WriteBankRepository } from '@src/modules/manage/infrastructure/repositories/banks/write.repository';
import { ReadBankRepository } from '@src/modules/manage/infrastructure/repositories/banks/read.repository';
import { BankMapperProviders } from './mapper.provider';

export const BankProvider: Provider[] = [
  ...BankHandlersProviders,
  ...BankMapperProviders,
  {
    provide: LOCALIZATION_SERVICE,
    useClass: LocalizationService,
  },
  {
    provide: TRANSACTION_MANAGER_SERVICE,
    useClass: TransactionManagerService,
  },
  {
    provide: BANK_APPLICATION_SERVICE,
    useClass: BankService,
  },
  {
    provide: WRITE_BANK_REPOSITORY,
    useClass: WriteBankRepository,
  },
  {
    provide: READ_BANK_REPOSITORY,
    useClass: ReadBankRepository,
  },
  // {
  //   provide: TRANSFORM_RESULT_SERVICE,
  //   useClass: TransformResultService,
  // },
];
