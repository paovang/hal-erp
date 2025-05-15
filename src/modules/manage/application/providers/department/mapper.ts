import { Provider } from '@nestjs/common';
import { DepartmentDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/department.mapper';
import { DepartmentDataMapper } from '@src/modules/manage/application/mappers/department.mapper';

export const DepartmentMapperProviders: Provider[] = [
  DepartmentDataAccessMapper,
  DepartmentDataMapper,
];
