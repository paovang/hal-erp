import { DepartmentProvider } from './department';
import { Provider } from '@nestjs/common';
import { DocumentTypeProvider } from './documentType';
import { UserProvider } from './user';
import { UnitProvider } from './unit';
import { DepartmentUserProvider } from './departmentUser';

export const AllRegisterProviders: Provider[] = [
    ...DepartmentProvider, 
    ...DocumentTypeProvider,
    ...UserProvider,
];
