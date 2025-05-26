import { Provider } from '@nestjs/common';
import { DepartmentApproverDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/department-approver.mapper';
import { DepartmentApproverDataMapper } from '../../mappers/department-approver.mapper';

export const DepartmentApproverMapperProviders: Provider[] = [
  DepartmentApproverDataAccessMapper,
  DepartmentApproverDataMapper,
];
