import { DepartmentProvider } from './department';
import { Provider } from '@nestjs/common';

export const AllRegisterProviders: Provider[] = [...DepartmentProvider];
