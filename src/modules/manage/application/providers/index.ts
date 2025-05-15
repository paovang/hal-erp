import { DepartmentProvider } from './department/provider';
import { DepartmentHandlersProviders } from './department/command-handler.provider';
import { Provider } from '@nestjs/common';
import { DepartmentMapperProviders } from './department/mapper';

export const AllRegisterProviders: Provider[] = [
  ...DepartmentProvider,
  ...DepartmentHandlersProviders,
  ...DepartmentMapperProviders,
];
