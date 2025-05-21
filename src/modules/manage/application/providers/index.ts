import { DepartmentProvider } from './department';
import { Provider } from '@nestjs/common';
import { DocumentTypeProvider } from './documentType';
import { UserProvider } from './user';

export const AllRegisterProviders: Provider[] = [
  ...DepartmentProvider,
  ...DocumentTypeProvider,
  ...UserProvider,
];
