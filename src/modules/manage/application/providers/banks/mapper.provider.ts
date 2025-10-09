import { Provider } from '@nestjs/common';
import { BankDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/bank.mapper';
import { BankDataMapper } from '../../mappers/bank.mapper';

export const BankMapperProviders: Provider[] = [
  BankDataAccessMapper,
  BankDataMapper,
];
