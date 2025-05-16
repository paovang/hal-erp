import { DepartmentProvider } from './department';
import { Provider } from '@nestjs/common';
import { DocumentTypeProvider } from './documentType';

export const AllRegisterProviders: Provider[] = [
    ...DepartmentProvider, 
    ...DocumentTypeProvider,
];
