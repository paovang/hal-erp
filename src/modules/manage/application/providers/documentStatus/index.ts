import { Provider } from '@nestjs/common';
import { DocumentStatusHandlersProviders } from './command.provider';
import { DocumentStatusMapperProviders } from './mapper.provider';

export const DocumentStatusProvider: Provider[] = [
  ...DocumentStatusHandlersProviders,
  ...DocumentStatusMapperProviders,
];
